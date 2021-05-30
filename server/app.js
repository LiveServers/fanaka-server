import express from "express";
import cors from "cors";
import 'dotenv/config';
import mongoose from "mongoose";
import chalk from "chalk";
import {ApolloServer} from "apollo-server-express";
import helmet from "helmet";
import resolvers from "./resolvers";
import typeDefs from "./schema";
import {UserApi,SessionApi} from "./datasources";
import Logger from "./utils/logging";

const app = express();

(
    async ()=>{
        try {
            await mongoose.connect(process.env.DB_CONNECTION_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Connected successfully to our datasource');
        } catch (e) {
            Logger.log(
                    'error',
                    'Error: ',
                    {
                        fullError: e,
                        request: 'connecting to fanaka server database',
                        technicalMessage: e.message,
                        customerMessage: "Could not process your information",
                    },
                    );
            throw new Error('Could not connect, please contact us if problem persists');
        }
}
)();

const listOfOriginsAllowed = process.env.ORIGIN.split(',');

const options = {
    origin: function (origin, callback) {
        if(!origin){
            callback(null, true)
        } else {
            if (listOfOriginsAllowed.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        }
    }
};

app.use(cors(options));

app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources:()=>({
        userApi:new UserApi(),
        sessionApi:new SessionApi()
    }),
    context:async({req})=>{
        return {req}
    },
    formatError:(err)=>({
        message:err.message
    }),
    introspection: process.env.NODE_ENV !== 'production',
    playground: process.env.NODE_ENV !== 'production',
});


server.applyMiddleware({app,cors:false});

app.listen(process.env.PORT,()=>console.log(chalk.green(`🚀 App running on http://localhost:${process.env.PORT}${server.graphqlPath}`)));

export default app;