import { CronJob } from 'cron';
import UserModel from '../models/Users/UserModel';
import Logger from './logging';

const expireToken = (email) => {
  const hour = new Date().setHours(new Date().getHours() + 1);
  // //for testing purposes, lets use a minute
  // let min = new Date().setMinutes(new Date().getMinutes() + 1);
  const expire = new CronJob(
    new Date(hour),
    async () => {
      try {
        await UserModel.updateOne({ email }, { token: '' });
      } catch (e) {
        Logger.log('error', 'Error: ', {
          fullError: e,
          request: 'deleting user token from database',
          technicalMessage: e.message,
          customerMessage: 'Could not process your information',
        });
        throw new Error('Could not process your information');
      }
    },
    null,
    true,
    'Africa/Nairobi'
  );
  expire.start();
};

export default expireToken;
