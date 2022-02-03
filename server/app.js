import http from "http";
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chalk from 'chalk';
import {ApolloServer, UserInputError} from 'apollo-server-express';
import helmet from 'helmet';
import expressJwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import resolvers from './resolvers';
import typeDefs from './schema';
import { UserApi, SessionApi, SemesterApi, UnitsAPI, RoomApi } from './datasources';
import Logger from './utils/logging';
import UserModel from './models/Users/StudentModel';
import { storage } from "./utils/config";
import RoomModel from "./models/Room";
import { returnActiveUsers, findActiveUser } from './utils/users';

const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log('Connected successfully to our datasource');
  } catch (e) {
    Logger.log('error', 'Error: ', {
      fullError: e,
      request: 'connecting to fanaka server database',
      technicalMessage: e.message,
      customerMessage: 'Could not process your information',
    });
    throw new Error('Could not connect, please contact us if problem persists');
  }
})();
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The origin for this CORS config to allow requests from
const origin = 'http://localhost:4001';

// The response header to share across origins
const responseHeader = 'Content-Type';

// The maximum amount of time the browser can make requests before it must
// repeat preflighted requests
const maxAgeSeconds = 3600;

// The name of the method
// See the HttpMethod documentation for other HTTP methods available:
// https://cloud.google.com/appengine/docs/standard/java/javadoc/com/google/appengine/api/urlfetch/HTTPMethod
const method = 'GET';
async function configureBucketCors() {
  await storage.bucket(process.env.GCP_BUCKET_ID).setCorsConfiguration([
    {
      maxAgeSeconds,
      method: ["GET", "HEAD", "DELETE", "PUT", "POST"],
      origin: [origin],
      responseHeader: [responseHeader,"access-control-allow-origin"],
    },
  ]);
}

configureBucketCors().catch(console.error);

const listOfOriginsAllowed = process.env.ORIGIN.split(',');

const options = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
    } else if (listOfOriginsAllowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
const httpServer = http.createServer(app);

export const socketConnection = new Server(httpServer,{
  cors: options
});

socketConnection.on("connection",socket=>{
  let users = [];
  socket.on("details",async ({userName,room})=>{
    // lets make sure the room actually exists
    const roomData = await RoomModel.findOne({roomName:room});
    // socket.emit("msg","Room could not be found 2");
    if(!roomData){
      socket.emit("error","Room could not be found");
      Logger.log('error', 'Error: ', {
        fullError: "Room could not be found",
        request: 'connect to room',
        technicalMessage: "Room could not be found",
        customerMessage: 'Could not retrieve your information',
      });
      throw new Error("Room could not be found");
    }
    users.push({
      userName,
      room,
      userId:socket.id
    });
    socket.join(room);
    socket.to(room).emit("messageToSingleUser",`${userName} has joined the room`);

    socketConnection.to(room).emit("common-message",`Welcome to ${room} room`);

    socketConnection.to(room).emit("all-users", {users:returnActiveUsers(users,room)});

  });

  socket.on("chat", async ({message,id,from, room}) => {
    socket.join(room);
    if(!message){
      throw new UserInputError("Message cant be empty");
    }
    socketConnection.in('4.1').emit("message", `${message}`);
    try {
      await RoomModel.findOne({_id:id}).exec((err,rooms)=>{
        rooms?.messages.push({
          from,
          subject:message,
        });
        rooms.save();
      });
    }catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'addMessage',
        technicalMessage: e.message,
        customerMessage: 'Could not add message',
      });
      throw new Error('An error occurred');
    }

  });

  // socket.on("disconnecting", ()=>{
  //     const leftUsers = inactiveUsers(socket.id);
  //     if(leftUsers){
  //         socketConnection.to(leftUsers.room).emit("new message",appendMessages(`${leftUsers.name} has left the room`));
  //
  //         //remove the user from list of active users
  //         socketConnection.to(leftUsers.room).emit("all-users", {users:roomActiveUsers(leftUsers.room)});
  //     }
  // });
});
app.use(cors(options));

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === 'production' ? undefined : false,
  })
);
app.use(cookieParser());
app.use(
  expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    getToken: (req) => req.cookies.fanaka,
    credentialsRequired: false,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userApi: new UserApi(),
    sessionApi: new SessionApi(),
    semesterApi: new SemesterApi(),
    unitsApi: new UnitsAPI(),
    roomApi: new RoomApi(),
  }),
  context: async ({ req, connection, res }) => {
    if (connection) {
      return connection.context;
    }
    const user = req.user || '';
    let found;
    if (user) {
      found = await UserModel.findOne({
        _id: req?.user.id,
      });
    }
    return { req, res, found };
  },
  formatError: (err) => ({
    message: err.message,
  }),
  introspection: process.env.NODE_ENV !== 'production',
  playground: process.env.NODE_ENV !== 'production',
});


server.applyMiddleware({ app, cors: false });

httpServer.listen(process.env.PORT, () =>
  console.log(
    chalk.bgYellow(
      `🚀 App running on http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  )
);

export default app;
