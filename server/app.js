import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import {ApolloServer} from "apollo-server-express";

(
    async ()=>{
        try {
            await mongoose.connect(process.env.DB_CONNECTION_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected successfully to our datasource');
        } catch (e) {
            throw new Error('Could not connect, please contact us if problem persists');
        }
}
)();

const app = express();

app.use(cors({
    origin:process.env.ORIGIN
}));

app.listen(process.env.PORT,()=>console.log(`🚀 App running on http://localhost/${process.env.PORT}`));

export default app;