import { AuthenticationError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import SemesterModel from '../../models/Semester/SemesterModel';
import Logger from '../../utils/logging';

export class SemesterApi {
  async createSemester(args, found) {
    const {
      input: { path, semester, year },
    } = args;
    try {
      // const user = await getUser(req);
      if (!found) {
        throw new AuthenticationError('Please sign in to proceed');
      }

      // if(user.role !== "admin"){
      //     throw new Error("You are authorised");
      // }
      // we'll remove this once we authenticate with cookies :)
      // const response = await UserModel.findById({_id:user.id});

      const semesterData = new SemesterModel({
        _id: uuidv4(),
        path,
        semester,
        year,
        unitCreator: found,
      });

      const result = await semesterData.save();
      console.log(result);
      return result;
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'signing in user/authenticating',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }

  async getAllSemesters(args) {
    try {
      const response = await SemesterModel.find({ year: args.year }).populate('Units');
      return response;
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'getAllSemesters',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }
}
