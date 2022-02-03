import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { v4 as uuidv4 } from 'uuid';
import UnitsModel from '../../models/Units/UnitsModel';
import Logger from '../../utils/logging';
import checkFileSize from '../../utils/checkFileSize';
import uploadFiles from '../../utils/uploadFiles';
import encrypt from "../../utils/encrypt";
import UserModel from "../../models/Users/StudentModel";

export class UnitsAPI {
  async getAllUnits(args,found) {
    try {
      if(!found){
        throw new AuthenticationError("You are not allowed to perform this action");
      }
      const { courseCode } = args;
      const response = await UnitsModel.find({ courseCode: courseCode });
      const check = response && Array.isArray(response) && response.length > 0 && response.some(item=>item.school !== found.school);
      if(check){
        throw new AuthenticationError("Not allowed to fetch files");
      }else {
        return response;
      }
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'getAllUnits',
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
          'You are not allowed to perform this action'
        );
      }
      // lets fetch units with the specific ID to make sure the correct person is actually performing this action
      if(args.input.school !== found.school){
        throw new AuthenticationError('You are not allowed to perform this action');
      }
      // now we need to upload the files to google cloud storage
      const {
        input: { semester, year, unitName, files, school, certification, programme, courseCode },
      } = args;
      let arr = [];
      let newUnitName;
      unitName.split(" ").forEach(item=>{
        arr.push(item.replace(item[0],item[0].toUpperCase()))
      });
      newUnitName = arr.join(' ');
      const unitResponse = await UnitsModel.findOne({unitName:newUnitName});
      if(unitResponse){
        throw new Error("Unit already exists");
      }
      const res = await UnitsModel.findOne({courseCode:courseCode.toUpperCase()});
      if(res){
        throw new Error("Unit already exists due to similar courseCode");
      }
      const filePaths = [];
      const fileNames = [];
      for (let i = 0; i < files.length; i++) {
        const { filename, createReadStream } = await files[i];
        const oneMb = 1000000;
        if (checkFileSize(createReadStream, oneMb)) {
          await uploadFiles(createReadStream, filename, `${newUnitName}/`);
          filePaths.push(
            `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${unitName}/${filename}`
          );
          fileNames.push(filename);
        } else {
          throw new UserInputError('Please upload a file less than 1MB');
        }
      }
      const units = new UnitsModel({
        _id: uuidv4(),
        unitCreator: found,
        semester: semester,
        fileNames,
        unitName:newUnitName,
        year,
        school,
        certification,
        programme,
        courseCode:courseCode.toUpperCase(),
        files: filePaths,
      });
      await units.save();

      return {
        status: true,
        message: 'Successfully created unit',
      };
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'create unit api',
        technicalMessage: e.message,
        customerMessage: 'Could not retrieve your information',
      });
      throw new Error('An error occured');
    }
  }

  // this function basically does similar stuff to the above one only difference is updating
  async uploadFilesToExistingUnit(args, found) {
    try {
      if (!found) {
        throw new AuthenticationError(
            'You are not allowed to perform this action'
        );
      }
      // lets fetch units with the specific ID to make sure the correct person is actually performing this action
      const validation = await UnitsModel.findOne({_id:args?.input?.unitId});
      if(validation.school !== found.school){
        throw new AuthenticationError('You are not allowed to perform this action');
      }
      // now we need to upload the files to google cloud storage/cloudinary or s3 bucket and update the units model
      const {
        input: { unitName, files, unitId },
      } = args;
      // we need to make a request to the Semester model
      const filePaths = [];
      const fileNames = [];
      for (let i = 0; i < files.length; i++) {
        const { filename, createReadStream } = await files[i];
        const oneMb = 1000000;
        if (checkFileSize(createReadStream, oneMb)) {
          await uploadFiles(createReadStream, filename,`${unitName}/`);
          filePaths.push(
              `https://storage.googleapis.com/${process.env.GCP_BUCKET_ID}/${unitName}/${filename}`
          );
          fileNames.push(filename);
        } else {
          throw new UserInputError('Please upload a file less than 1MB');
        }
      }
      await UnitsModel.findOne({_id:unitId}).exec((err,units)=>{
        for(let i=0;i<filePaths.length;i++){
          units?.files?.push(filePaths[i]);
          units?.fileNames?.push(fileNames[i]);
        }
        Promise.all([units.save()]);
      });

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

  async fetchFilesForSpecificUnit(args,found){
    try{
      if (!found) {
        throw new AuthenticationError(
            'You are not allowed to perform this action'
        );
      }
     const response = await UnitsModel.find({_id:args.id}).select('fileNames files');
      // lets encrypt the filePaths so on the client, no one can get the urls
      let encryptedUrl = [];
      for (const item of response[0]?.files) {
        let encrypted = encrypt(item);
        encryptedUrl.push(encrypted);
      }

      return UnitsAPI.concatArr(encryptedUrl,response[0]?.fileNames);
    }catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'create unit',
        technicalMessage: e.message,
        customerMessage: 'Could not retrieve your information',
      });
      throw new Error('An error occured');
    }
  }

  static async concatArr(fileUrls,fileNames){
    return {
      fileUrls,
      fileNames
    }
  }

  async fetchStudentDetailsAndFilesForRegisteredSemester(args,found){
    try {
      if(!found){
        throw new AuthenticationError("Please login");
      }
      if(found.role !== "student"){
        throw new AuthenticationError("You are not allowed to perform this action");
      }
      const userResponse = await UserModel.findOne({_id:args.id});
      const unitResponse = await UnitsModel.find({semester:userResponse.semester,programme:userResponse.currentEnrolledProgramme,certification:userResponse.certification}).select('fileNames files unitName courseCode');
      // lets encrypt the filePaths so on the client, no one can get the urls

      let newUnitResponse = unitResponse;
      const encryptedFiles = Array.isArray(unitResponse) && unitResponse.length > 0 ? unitResponse.map(item=>item.files.map(i=> {
        return encrypt(i)
      })):[];
      for(let i=0;i<newUnitResponse.length;i++){
        delete newUnitResponse[i].files;
        delete newUnitResponse[i]._id;
        newUnitResponse[i].files = encryptedFiles[i]
      }
      return {
        result:newUnitResponse,
        studentDetails:{
          certification:userResponse.certification,
          currentEnrolledProgramme:userResponse.currentEnrolledProgramme,
          semester:userResponse.semester,
          id:userResponse._id
        }
      }
    }catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'fetchStudentDetailsAndFilesForRegisteredSemester',
        technicalMessage: e.message,
        customerMessage: 'Could not process your information',
      });
      throw new Error('Could not process your information');
    }
  }
}
