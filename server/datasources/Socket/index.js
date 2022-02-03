import Logger from '../../utils/logging';
import {AuthenticationError, UserInputError} from "apollo-server-express";
import { v4 as uuidv4 } from 'uuid';
import RoomModel from "../../models/Room";

export class RoomApi{
    async createRoom(args,found){
        /* args contains roomName, school, programme, certificate
        *
        * */
        try {
            if(!found){
                throw new AuthenticationError("Not allowed to perform this action");
            }
            if(found.role === "student"){
                throw new Error("Students are not allowed to perform this action");
            }
            const {roomName, school, programme, certificate, year, semester} =  args.input;
            // lets now check and confirm that the room doesnt exist
            const roomDetails = await RoomModel.findOne({roomName});
            if(roomDetails){
                throw new UserInputError("Room already exists");
            }
            // the room doesnt exist, then we proceed to create it
            const room = new RoomModel({
                _id: uuidv4(),
                roomName,
                school,
                programme,
                certificate,
                year,
                semester,
                unitCreator:found,
            });

            const response = await room.save();
            return {
                id: response._id,
                status: true,
                message: "room created successfully"
            }

        }catch (e) {
            Logger.log('error', 'Error: ', {
                fullError: e,
                request: 'createRoom',
                technicalMessage: e.message,
                customerMessage: 'Could not create the room',
            });
            throw new Error('An error occurred');
        }
    }

    async fetchMessages (args, found){
        try {
            if(!found){
                throw new Error("You are not allowed to perform this action");
            }
            const response = await RoomModel.findOne({roomName:args.roomName}).select('messages');
            return response
        }catch (e) {
            Logger.log('error', 'Error: ', {
                fullError: e,
                request: 'fetchMessages',
                technicalMessage: e.message,
                customerMessage: 'Could not fetchMessages',
            });
            throw new Error('An error occurred');
        }
    }

    async addMessages(args, found){
        try {
            if(!found){
                throw new Error("You are not allowed to perform this action");
            }
            await RoomModel.findOne({_id:args.id}).exec((err,room)=>{
                room?.messages.push({
                    from:args.from,
                    subject: args.message,
                });
            });
            return {
                status:true,
                message: "success",
            }
        }catch (e) {
            Logger.log('error', 'Error: ', {
                fullError: e,
                request: 'fetchMessages',
                technicalMessage: e.message,
                customerMessage: 'Could not addMessages',
            });
            throw new Error('An error occurred');
        }
    }

}
