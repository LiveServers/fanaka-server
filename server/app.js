import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chalk from 'chalk';
import { ApolloServer } from 'apollo-server-express';
import helmet from 'helmet';
import expressJwt from 'express-jwt';
import cookieParser from 'cookie-parser';
import resolvers from './resolvers';
import typeDefs from './schema';
import { UserApi, SessionApi, SemesterApi, UnitsAPI } from './datasources';
import Logger from './utils/logging';
import UserModel from './models/Users/UserModel';

const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
// app.use(graphqlUploadExpress());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    userApi: new UserApi(),
    sessionApi: new SessionApi(),
    semesterApi: new SemesterApi(),
    unitsApi: new UnitsAPI(),
  }),
  context: async ({ req, connection, res }) => {
    if (connection) {
      return connection.context;
    }
    const user = req.user || '';
    let found;
    if (user) {
      found = await UserModel.findOne({
        _id: req.user.id,
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

app.listen(process.env.PORT, () =>
  console.log(
    chalk.bgYellow(
      `🚀 App running on http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  )
);

export default app;
