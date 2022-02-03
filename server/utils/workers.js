// //const workerPool = require("workerpool");
// const fs = require("fs");
// // const Logger = require('./logging.js');
// // const { bucket } = ('./config.js');
// const { Storage } = require('@google-cloud/storage');
//
// const storage = new Storage({
//     projectId: process.env.GCP_PROJECT_ID,
//     credentials: {
//         client_email: process.env.GCP_CLIENT_EMAIL,
//         private_key: process.env.GCP_PRIVATE_KEY
//             ? process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
//             : '',
//     },
// });
// const bucket = storage.bucket(process.env.GCP_BUCKET_ID)
// const convertToPdf = (createReadStream,folderName,newFileName)=> {
//     console.log("this gets called");
//     // return new Promise((resolve,reject)=>{
//         try{
//             createReadStream().pipe(
//                 bucket
//                     .file(folderName+newFileName)
//                     .createWriteStream({ resumable: false, gzip: true })
//             )
//                 // .on('error', (err) => console.log('err --->',err))
//                 // .on('finish', ()=>console.log('finished upload'));
//         }
//         catch(e){
//             console.log("This is the error from uploading------?",e)
//             // Logger.log('error', 'Error: ', {
//             //     fullError: e,
//             //     request: 'convert file worker',
//             //     technicalMessage: e.message,
//             //     customerMessage: 'Could not retrieve your information',
//             // });
//             throw new Error('An error occured');
//         }
//     // })
// }
//
// const {parentPort, workerData} = require("worker_threads");
// const {filePath,folderName,newFileName} = workerData;
// parentPort.postMessage(convertToPdf(filePath,folderName,newFileName));
//
// //
// // workerPool.worker({
// //     convertToPdf,
// // });
