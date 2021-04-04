import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import {UserInputError,ApolloError,AuthenticationError} from "apollo-server-express";
import "dotenv/config";
import StudentsModel from "../../models/Users/StudentModel";
import getUser from "../../auth";

export class StudentsApi{

    async signUp(args){
        const {
            input:{
                name,
                email,
                password,
                regNo,
                school,
                role
            }
        } = args;
        try{
            const response = await StudentsModel.findOne({email:email});
        
            if(response){
              throw new UserInputError('Email already in use')
               
            }
            
            if(password.length < 8){
                throw new UserInputError('Password length must be greater than 8 characters long');
            }

             const newStudent = new StudentsModel({
                 _id:uuidv4(),
                 name,
                 email,
                 password,
                 regNo,
                 school,
                 role
             });

            const hash = await bcrypt.hash(password, 10);
            
    
            newStudent.password = hash;
            const user = await newStudent.save();
            const token = jwt.sign({email:user.email,id:user._id,role:user.role},process.env.SECRET,{expiresIn: '1d'});

            return {
                status:true,
                id:user._id,
                token
            };
        }
        catch(e){
            console.log(e);
            throw new Error(e);
        }
    }

    async simp(req){
        const user = await getUser(req);
        console.log(user);
        if(!user){
            throw new AuthenticationError("Please sign in to proceed");
        }
        if(user.role != "admin"){
            throw new ApolloError("Not authorized");
        }
        return "Congrats, correctly authenticated";
    }
}
