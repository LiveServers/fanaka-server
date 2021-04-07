import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {UserInputError,AuthenticationError} from "apollo-server-express";
import "dotenv/config";
import UserModel from "../../models/Users/UserModel";


 export class SessionApi{
    async signIn(args){
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

            if(response.active === 0){
                throw new AuthenticationError("Please verify your email address to proceed");
            }
            const token = jwt.sign({
                email: response.email,
                id: response._id,
                role:response.role
            }, process.env.SECRET, {
                expiresIn: '1d'
            });

            return {
                status: true,
                id: response._id,
                token
            };

        }
        catch(e){
            console.log(e);
            throw new Error(e);
        }
    }
}