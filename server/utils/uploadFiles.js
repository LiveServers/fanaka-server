import Logger from './logging';
import { bucket } from './config';

const createFile = async (createReadStream, newFileName, folderName) => {
  return new Promise((resolve, reject) => {
    try {
      createReadStream()
        .pipe(
          bucket
            .file(folderName+newFileName)
            .createWriteStream({ resumable: false, gzip: true })
        )
        .on('error', (err) => reject(err))
        .on('finish', resolve);
    } catch (e) {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'upload to cloud',
        technicalMessage: e.message,
        customerMessage: 'Could not create unit',
      });
      reject(e);
    }
  });
};

export default createFile;
