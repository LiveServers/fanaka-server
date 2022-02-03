import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import {UserInputError} from 'apollo-server-express';
import 'dotenv/config';
import Logger from '../../utils/logging';
import UserModel from "../../models/Users/StudentModel";

export class SessionApi {
  /*
  * @fields
  * userName registrationNumber password certification, currentYearOfStudy currentEnrolledSemester
  * we also need to create a regex for the regnumber --> ICT-G-4-0726-18
  * E B C H --> 0719509732
  * */

  async studentSignUp(args,res){
    try{
      const resp = await UserModel.findOne({userName:args.input.userName});
      if(resp){
        throw new UserInputError("Username already taken");
      }
      const {password,regNo,userName,certification, currentEnrolledProgramme,
        year,
        semester,
        school} = await args.input;
      const student = new UserModel({
        _id: uuidv4(),
        certification,
        regNo,
        userName,
        currentEnrolledProgramme,
        year,
        semester,
        school,
        role: "student",
      });
      const hash = await bcrypt.hash(password, 10);

      student.password = hash;
      const response = await student.save();
      const token = jwt.sign(
          {
            userName: response?.userName,
            id: response._id,
            role: response?.role,
          },
          process.env.SECRET,
          {
            expiresIn: '1d',
          }
      );

      res?.cookie('fanaka', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // on https
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });
      return {
        status: true,
        message: "successful sign up",
        id: response._id,
        role: response?.role,
        userName: response?.userName,
      };
    }catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'studentSignUp',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('We encountered an error, please try again later');
    }
  }

  async signIn(args, res) {
    const { userName, password } = args;
    try {
      const response = await UserModel.findOne({
        userName,
      });

      if (!response) {
        throw new UserInputError('No such username registered');
      }

      const match = await bcrypt.compare(password, response.password);

      if (!match) {
        throw new UserInputError('Invalid credentials');
      }

      const token = jwt.sign(
          {
            userName: response?.userName,
            id: response._id,
            role: response?.role,
          },
          process.env.SECRET,
          {
            expiresIn: '1d',
          }
      );

      res?.cookie('fanaka', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // on https
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      });
      return {
        status: true,
        id: response._id,
        role: response.role,
        userName: response?.userName,
      };
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'studentSignIn',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }

  async logOut(res){
    try{
      res.clearCookie("fanaka");
      return {
        status:true,
        message:"successfully logged you out"
      }
    }catch(e){
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'studentSignIn',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not log you out');
    }
  }
}
