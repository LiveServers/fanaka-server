const Logger = require('./logging');

const checkFileSize = async (createReadStream, maxSize) => {
  new Promise((resolve, reject) => {
    let filesize = 0;
    const stream = createReadStream();
    stream.on('data', (chunk) => {
      filesize += chunk.length;
      if (filesize > maxSize) {
        reject(filesize);
      }
      return true;
    });
    stream.on('end', () => resolve(filesize));
    stream.on('error', (e) => {
      Logger.log('error', 'Error: ', {
        fullError: e,
        request: 'create unit',
        technicalMessage: e.message,
        customerMessage: 'Could not retrieve your information',
      });
      reject(e);
    });
  });
};

export default checkFileSize;
