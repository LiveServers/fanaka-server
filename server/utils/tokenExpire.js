import { CronJob } from'cron';
import UserModel from "../models/Users/UserModel";

const expireToken = (email)=>{
    let hour = new Date().setHours(new Date().getHours()+1);
    // //for testing purposes, lets use a minute
    // let min = new Date().setMinutes(new Date().getMinutes() + 1);
    let expire = new CronJob(new Date(hour),async()=>{
        try{
            await UserModel.updateOne({email},{token:""});
        }catch(e){
            throw new Error(e);
        }
    }, null, true, 'Africa/Nairobi');
    expire.start();
}

export default expireToken;