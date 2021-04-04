import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import chalk from "chalk";
import {ApolloServer} from "apollo-server-express";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import {StudentsApi,SessionApi} from "./datasources";

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


const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources:()=>({
        studentsApi:new StudentsApi(),
        sessionApi:new SessionApi()
    }),
    context:async({req})=>{
        return {req}
    },
    formatError:(err)=>({
        message:err.message
    })
});

const app = express();

app.use(cors({
    origin:process.env.ORIGIN
}));

server.applyMiddleware({app,cors:false});

app.listen(process.env.PORT,()=>console.log(chalk.green(`🚀 App running on http://localhost:${process.env.PORT}${server.graphqlPath}`)));

export default app;