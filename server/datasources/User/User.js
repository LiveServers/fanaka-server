import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import {UserInputError,ApolloError,AuthenticationError} from "apollo-server-express";
import "dotenv/config";
import shortId from "shortid";
import UserModel from "../../models/Users/UserModel";
import getUser from "../../auth";
import sendEmail from "../../utils/sendEmail";
import expireToken from "../../utils/tokenExpire";
import Logger from "../../utils/logging";

export class UserApi{

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
            const response = await UserModel.findOne({email:email});
        
            if(response){
              throw new UserInputError('Email already in use')
               
            }
            
            if(password.length < 8){
                throw new UserInputError('Password length must be greater than 8 characters long');
            }
            //verification token
            const verificationToken = shortId.generate();

            const newUser = new UserModel({
                 _id:uuidv4(),
                 name,
                 email,
                 password,
                 regNo,
                 school,
                 role,
                 token:verificationToken,
                 active:0
            });

            const hash = await bcrypt.hash(password, 10);
            
    
            newUser.password = hash;
            const user = await newUser.save();


            //before generating access token, first verify mail
            const senderDetails = {
                email:process.env.FANAKA_EMAIL,
                message:`<p>Thank you for signing up with Fanaka,
                Please click on this <a href="${process.env.FRONTEND_BASE_URL}/verify/${verificationToken}}">link</a> to verify your account.
                This link will expire after ${process.env.EXPIRY_TIME} hour</p>`,
                subject:"Email Verification",
                name:process.env.FANAKA_EMAIL_NAME
            }
            await sendEmail(user.email,senderDetails);
            await expireToken(user.email);
            const token = jwt.sign({email:user.email,id:user._id,role:user.role},process.env.SECRET,{expiresIn: '1d'});

            return {
                status:true,
                id:user._id,
                token
            };
        }
        catch(e){
            Logger.log(
                    'error',
                    'Error: ',
                    {
                        fullError: e,
                        request: 'creating user/sign up request',
                        technicalMessage: e.message,
                        customerMessage: "Could not process your information",
                    },
                    );
            throw new Error("Could not process your information");
        }
    }

    async verifyEmail(args){
        const {token} = args;
        try{
            const response =  await UserModel.findOne({token});
            if(!response){
                throw new ApolloError("Token not found");
            }
            await UserModel.updateOne({email:response.email},{active:1,token:""});
            return "Email successfully verified";
        }
        catch(e){
            Logger.log(
                'error',
                'Error: ', {
                    fullError: e,
                    request: 'verifying token/user email',
                    technicalMessage: e.message,
                    customerMessage: "Could not process your information",
                },
            );
            throw new Error("Could not process your information");
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
