import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import UnitsModel from '../../models/Units/UnitsModel';
import SemesterModel from '../../models/Semester/SemesterModel';
import FilesModel from '../../models/Files/FilesModel';
import Logger from '../../utils/logging';
import checkFileSize from '../../utils/checkFileSize';
import uploadFiles from '../../utils/uploadFiles';

export class UnitsAPI {
  async getAllUnits(args) {
    try {
      const { semester } = args;
      const response = await UnitsModel.find({ semester }).populate('semester');
      const result =
        (await Array.isArray(response)) && response
          ? response.map((res) => UnitsAPI.filterUnitsresponse(res))
          : [];
      return result;
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'get all units',
        technicalMessage: e.message,
        customerMessage: 'Could not retrieve your information',
      });
      throw new Error('An error occured');
    }
  }

  async createUnit(args, found) {
    try {
      if (!found) {
        throw new AuthenticationError(
          'You are not allowed to create any units'
        );
      }
      // now we need to upload the files to google cloud storage/cloudinary or s3 bucket and update the units model
      const {
        input: { semesterId, year, unitName, files },
      } = args;
      // we need to make a request to the Semester model
      const filePaths = [];
      const fileNames = [];
      for (let i = 0; i < files.length; i++) {
        const { filename, createReadStream } = await files[i];
        const oneMb = 1000000;
        if (checkFileSize(createReadStream, oneMb)) {
          await uploadFiles(createReadStream, filename);
          filePaths.push(
            `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${filename}`
          );
          fileNames.push(filename);
        } else {
          throw new UserInputError('Please upload a file less than 1MB');
        }
      }
      const semesterResponse = await SemesterModel.find({ _id: semesterId });
      const fileUploadsResponse = new FilesModel({
        _id: uuidv4(),
        files: filePaths,
        fileNames,
      });
      await fileUploadsResponse.save();

      const units = new UnitsModel({
        _id: uuidv4(),
        unitCreator: found,
        semester: semesterResponse[0],
        unitName,
        year,
        files: fileUploadsResponse,
      });
      await units.save();

      return {
        status: true,
        message: 'Successfully created unit',
      };
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'create unit',
        technicalMessage: e.message,
        customerMessage: 'Could not retrieve your information',
      });
      throw new Error('An error occured');
    }
  }

  static filterUnitsresponse(response) {
    return {
      author: response.unitCreator,
      year: response.year,
      unitName: response.unitName,
      semester: response.semester,
      files: response.files,
    };
  }
}
