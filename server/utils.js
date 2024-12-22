require('dotenv').config();

const { spawn } = require('child_process');
const { MongoClient, GridFSBucket } = require('mongodb');
const uri = process.env.mongodburi;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false
});

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('hackOharbour');
    bucket = new GridFSBucket(db, { bucketName: 'resume' });
    console.log('Connected to MongoDB and GridFS');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

// function retrievePDF(collectionName, email) {
//   const gfs = new GridFSStream(db, { collection: collectionName });

//   gfs.files.findOne({ email: email }, (err, file) => {
//     if (err) {
//       console.error('Error finding PDF:', err);
//       return;
//     }

//     if (!file) {
//       console.error('PDF not found with ID:', pdfId);
//       return;
//     }

//     const readStream = gfs.createReadStream({
//       _id: file._id,
//       filename: file.filename
//     });

//     let pdfData = '';
//     readStream.on('data', (chunk) => {
//       pdfData += chunk.toString('binary'); // Ensure 'binary' encoding
//     });
//     readStream.on('error', (err) => {
//       console.error('Error reading PDF:', err);
//     });
//     readStream.on('end', () => {
//       const pdfString = Buffer.from(pdfData, 'binary').toString('base64'); // Convert to base64 string
//       console.log('PDF retrieved and converted to string:', pdfString);

//       // Now you can use the pdfString variable for further processing
//       // Close the connection after using the string
//       return pdfString;
//     });
//   });
// }

// const executePython = async (script, arg1, arg2) => {
//   const py = spawn("python", [script, arg1, arg2]);

//   const result = await new Promise((resolve, reject) => {
//     let output;

//       py.stdout.on('data', (data) => {
//         output = data.toString();
//       });

//       py.stderr.on("data", (data) => {
//         console.error(`[python] Error occured: ${data}`);
//         reject(`Error occured in ${script}`);
//       });

//       py.on("exit", (code) => {
//         console.log(`Child process exited with code ${code}`);
//         resolve(output);
//       });
//   });

//   return result;
// }


// const executePythonone = async (script, arg2) => {
//   const py = spawn("python", [script, arg2]);

//   const result = await new Promise((resolve, reject) => {
//     let output = '';

//     py.stdout.on('data', (data) => {
//       output += data.toString();
//     });
//     py.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     py.stderr.on("data", (data) => {
//       console.error(`[python] Error occurred: ${data}`);
//       reject(`Error occurred in ${script}`);
//     });
//     py.stderr.on("data", (data) => {
//       console.error(`[python] Error occurred: ${data}`);
//       reject(`Error occurred in ${script}`);
//     });

//     py.on("exit", (code) => {
//       if (code === 0) {
//     py.on("exit", (code) => {
//       if (code === 0) {
//         resolve(output);
//       } else {
//         reject(`Child process exited with code ${code}`);
//       }
//     });
//       } else {
//         reject(`Child process exited with code ${code}`);
//       }
//     });
//   });

//   return result;
// }

// async function gettest(text){
//   const Q_list = [];
//   const parts = text.split('!@#ques');

//   for (const part of parts) {
//     const list_element = [];
  
//     if (part.includes('!@#opt')) {
//       try {
//         // Split the part into question and options
//         const [part_q, part_opt] = part.split('!@#opt');
  
//         const firstSpaceIndex = part_q.indexOf('\n');
//         const q_no = part_q.slice(0, firstSpaceIndex);  
//         const question = part_q.slice(firstSpaceIndex + 1);
      
  
//         const [option_string, ans_string] = part_opt.split('!@#ans');
  
//         let i = 0;
//         let answer = ans_string[i];
//         while (!['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(answer)) {
//           i++;
//           answer = ans_string[i];
//         }
  
//         const option_list = option_string.split('\n');
  
//         const options_dict = {};
//         for (const option of option_list) {
//           if (option.length > 1) {
//             options_dict[option[0]] = option.slice(2);
//           }
//         }
  
  
//         const questionObj = {
//           question_no: parseInt(q_no),
//           question: question.trim(),
//           options: options_dict,
//           correct: answer
//         };
  
//         Q_list.push(questionObj);
  
//       } catch (error) {
//         console.error('Error parsing part:', part);
//       }
//     }
//   }
//   return Q_list
// }

module.exports = {
  connectToDatabase: connectToDatabase,
  // retrievePDF: retrievePDF,
  // executePython: executePython,
  // executePythonone: executePythonone,
  // gettest: gettest,
}
