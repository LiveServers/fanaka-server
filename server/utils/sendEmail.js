import nodeMailer from "nodemailer";
import "dotenv/config";

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
        throw new Error(e);
    }

}

export default sendEmail;