import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {UserInputError,AuthenticationError} from "apollo-server-express";
import "dotenv/config";
import UserModel from "../../models/Users/UserModel";
import Logger from "../../utils/logging";


 export class SessionApi{
    async signIn(args,res){
        const {email,password}=args;
        try{
            const response = await UserModel.findOne({
                email: email
            })

            if (!response){
                throw new UserInputError('No such email registered');
            }

            const match = await bcrypt.compare(password, response.password);

            if (!match) {
                throw new UserInputError('Invalid credentials')
            }

            // if(response.active === 0){
            //     throw new AuthenticationError("Please verify your email address to proceed");
            // }
            const token = jwt.sign({
                email: response.email,
                id: response._id,
                role:response.role
            }, process.env.SECRET, {
                expiresIn: '1d'
            });

            res.cookie("fanaka", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", //on https
                maxAge: 1000 * 60 * 60 * 24 * 1,
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
            })
            return {
                status: true,
                id: response._id
            };

        }
        catch(e){
            Logger.log(
                    'error',
                    'Error: ',
                    {
                        fullError: e,
                        request: 'signing in user/authenticating',
                        technicalMessage: e.message,
                        customerMessage: "Could not process your information",
                    },
                    );
            throw new Error("Could not process your information");
        }
    }
}