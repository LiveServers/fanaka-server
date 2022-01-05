import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const getUser = async (req) => {
  const authToken = req.headers.authorization || '';
  if (!authToken) {
    throw new AuthenticationError('Token required');
  }
  const token = authToken.split('Bearer ')[1];
  if (!token) throw new AuthenticationError('You should provide a token!');
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

export default getUser;
