import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { UserInputError, ApolloError } from 'apollo-server-express';
import 'dotenv/config';
import UserModel from '../../models/Users/UserModel';
import Logger from '../../utils/logging';

export class UserApi {
  async signUp(args) {
    const {
      input: { email, password },
    } = args;
    try {
      const response = await UserModel.findOne({ email });

      if (response) {
        throw new UserInputError('Email already in use');
      }

      if (password.length < 8) {
        throw new UserInputError(
          'Password length must be greater than 8 characters long'
        );
      }
      // verification token
      // const verificationToken = shortId.generate();

      const newUser = new UserModel({
        _id: uuidv4(),
        email,
        password,
      });

      const hash = await bcrypt.hash(password, 10);

      newUser.password = hash;
      const user = await newUser.save();

      // before generating access token, first verify mail
      // const senderDetails = {
      //     email:process.env.FANAKA_EMAIL,
      //     message:`<p>Thank you for signing up with Fanaka,
      //     Please click on this <a href="${process.env.FRONTEND_BASE_URL}/verify/${verificationToken}}">link</a> to verify your account.
      //     This link will expire after ${process.env.EXPIRY_TIME} hour</p>`,
      //     subject:"Email Verification",
      //     name:process.env.FANAKA_EMAIL_NAME
      // }
      // await sendEmail(user.email,senderDetails);
      // await expireToken(user.email);
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.SECRET,
        { expiresIn: '1d' }
      );

      return {
        status: true,
        id: user._id,
        token,
      };
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'creating user/sign up request',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }

  async verifyEmail(args) {
    const { token } = args;
    try {
      const response = await UserModel.findOne({ token });
      if (!response) {
        throw new ApolloError('Token not found');
      }
      await UserModel.updateOne(
        { email: response.email },
        { active: 1, token: '' }
      );
      return 'Email successfully verified';
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'verifying token/user email',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }
}
