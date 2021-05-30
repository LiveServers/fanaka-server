import nodeMailer from "nodemailer";
import "dotenv/config";
import Logger from "./logging";

const transport = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    auth:{
        user:process.env.FANAKA_EMAIL,
        pass:process.env.FANAKA_EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
});


const sendEmail = async (userEmail,from={})=>{
    /**
     * 
     * from will contain message,subject,html,senderEmail,senderName and link
     */
    try{
        await transport.sendMail({
            from: `${from.name} <${from.email}>`,
            to: userEmail,
            subject: from.subject,
            html: from.message
        });
    }catch(e){
        Logger.log(
                    'error',
                    'Error: ',
                    {
                        fullError: e,
                        request: 'sending email service',
                        technicalMessage: e.message,
                        customerMessage: "Could not process your information",
                    },
                    );
        throw new Error("Could not process your information");
    }

}

export default sendEmail;