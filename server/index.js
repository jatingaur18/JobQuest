const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const port = 3000;
const { spawn } = require('child_process');
const fs = require('fs');
// const CONFIG = require('./config.json');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.mongodburi;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: false, // Set this to true if you are using self-signed certificates
  // tlsCAFile: '/path/to/ca.pem', // Uncomment if you have a specific CA file
});

let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db('hackOharbour');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}


app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  // code for checking resume score
});

app.post('/login', async (req, res) => {
  await connectToDatabase();
  if (!db) {
    return res.status(500).json({ message: "Database not connected" });
  }

  const userdata = req.body;
  const users = db.collection('users');
  try {
    const userarr = await users.find({}).toArray();

    const foundUser = userarr.find(x => x.email === userdata.email);
    if (foundUser) {
      if (foundUser.password === userdata.password) {
        res.status(200).json(foundUser);
      } else {
        res.status(401).json({ message: "Incorrect password" });
      }
    } else {
      res.status(401).json({ message: "User not found" });
    }
  } catch (err) {
    console.error('Error finding user', err);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post('/signup', async (req, res) => {
  const userdata = req.body;
  const db = client.db('hackOharbour');
  const users = db.collection('users');
  const userarr = await users.find({}).toArray();
  
  const foundUser = userarr.find(x => x.email === userdata.email);
  if(foundUser){
    res.status(409).json({message: "Email already exists"})
  }else{
    users.insertOne(userdata);
    res.status(200).json("signup successful");
  }
})

app.get('/company:cname', async (req, res) => {

  let companyName = req.params.cname.slice(1);
  console.log(companyName);
  const jobs = db.collection('jobs');
  const jobsarr = await jobs.find({Company: companyName}).toArray();

  res.status(200).json(jobsarr);
})

app.post('/createjob', async (req, res) => {
  
  const createjob = req.body;
  const jobs = db.collection('jobs');
  
  createjob['participants'] = [null];
  createjob['test'] = await gettest(await executePythonone('test_generator/test_generator.py', createjob.description));

  console.log(createjob);

  jobs.insertOne(createjob);
  res.status(200).send("done");
})

app.post('/applyjob', async (req, res) => {

  const jobs = db.collection('jobs');
  const resume = await db.collection('resume').findOne({email: req.body.email});
  const user = await db.collection('users').findOne({email: req.body.email});
  if(!resume){
    return res.status(404).send("resume not found");
  }

  const score = await executePython('filter.py', "resume.pdf", "jobdesc.pdf");
  console.log(score);

  const pushData = {
    email: user.email,
    name: user.username,
    score: score,
    link: "link"
  }

  jobs.updateOne(
    {ID: req.body.job.id},
    {$push: {participants: pushData}}
  );
  res.status(200).send("done");
})

function retrievePDF(collectionName, email) {
  const gfs = new GridFSStream(db, { collection: collectionName });

  gfs.files.findOne({ email: email }, (err, file) => {
    if (err) {
      console.error('Error finding PDF:', err);
      return;
    }

    if (!file) {
      console.error('PDF not found with ID:', pdfId);
      return;
    }

    const readStream = gfs.createReadStream({
      _id: file._id,
      filename: file.filename
    });

    let pdfData = '';
    readStream.on('data', (chunk) => {
      pdfData += chunk.toString('binary'); // Ensure 'binary' encoding
    });
    readStream.on('error', (err) => {
      console.error('Error reading PDF:', err);
    });
    readStream.on('end', () => {
      const pdfString = Buffer.from(pdfData, 'binary').toString('base64'); // Convert to base64 string
      console.log('PDF retrieved and converted to string:', pdfString);

      // Now you can use the `pdfString` variable for further processing
      // Close the connection after using the string
      return pdfString;
    });
  });
}

// app.post('/uploadresume', upload.single('resume'), async (req, res) => {

//   const fs = require('fs');
//   const resume = db.collection('resume');
//   const data = fs.readFileSync(req.file.path);

//   resume.insertOne({
//     email: req.headers.email,
//     filename: req.file.originalname,
//     contentType: req.file.mimetype,
//     size: req.file.size,
//     pdf: {
//       data: data,
//       contentType: req.file.mimetype
//     }
//   });

//   fs.unlinkSync(req.file.path);

//   res.status(200).send("done");
// })

app.get('/jobs', async (req, res) => {
    
  const jobsarr = await db.collection('jobs').find({}).toArray();

  let resarr = [];

  for (let i=0; i<jobsarr.length; i++){
    resarr.push({id: jobsarr[i].ID, title: jobsarr[i].title, company: jobsarr[i].Company, desc: jobsarr[i].description});
  }
  res.status(200).json(resarr);
})

app.get('/jobstatus:id', async (req, res) => {
    
  const jobID = req.params.id.slice(1);
  console.log(jobID);
  const jobsarr = await db.collection('jobs').find({}).toArray();
  foundjob = jobsarr.find(x => x.ID === 'googlebackend');
  if(foundjob){
    const dataToSend = (foundjob.participants).sort((a,b) => b.score - a.score)
    console.log(dataToSend);
    res.status(200).json(dataToSend);
  }else{
    res.status(404).send("job not found");
  }
})

app.get('/gettest:id', async (req, res) => {
  const id = req.params.id.slice(1);
  const questarr = await db.collection('jobs').findOne({ID: "rusted"});
    console.log(questarr);
  res.status(200).json(questarr.test);
})

const executePython = async (script, arg1, arg2) => {
  const py = spawn("python", [script, arg1, arg2]);

  const result = await new Promise((resolve, reject) => {
    let output;

      py.stdout.on('data', (data) => {
        output = data.toString();
      });

      py.stderr.on("data", (data) => {
        console.error(`[python] Error occured: ${data}`);
        reject(`Error occured in ${script}`);
      });

      py.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(output);
      });
  });

  return result;
}


const executePythonone = async (script, arg2) => {
  const py = spawn("python", [script, arg2]);

  const result = await new Promise((resolve, reject) => {
    let output;

      py.stdout.on('data', (data) => {
        output = data.toString();
      });

      py.stderr.on("data", (data) => {
        console.error(`[python] Error occured: ${data}`);
        reject(`Error occured in ${script}`);
      });

      py.on("exit", (code) => {
        console.log(`Child process exited with code ${code}`);
        resolve(output);
      });
  });

  return result;
}




async function gettest(text){
    const Q_list = [];
    const parts = text.split('!@#ques');

    for (const part of parts) {
        const list_element = [];
    
        // Check if the part contains options
        if (part.includes('!@#opt')) {
            try {
                // Split the part into question and options
                const [part_q, part_opt] = part.split('!@#opt');
    
                const firstSpaceIndex = part_q.indexOf('\n');
                const q_no = part_q.slice(0, firstSpaceIndex);    
                const question = part_q.slice(firstSpaceIndex + 1);
            
    
                // Split the options part into options and answer
                const [option_string, ans_string] = part_opt.split('!@#ans');
    
                let i = 0;
                let answer = ans_string[i];
                while (!['a', 'b', 'c', 'd', 'A', 'B', 'C', 'D'].includes(answer)) {
                    i++;
                    answer = ans_string[i];
                }
    
                // Split options into an array
                const option_list = option_string.split('\n');
    
                // Convert options to a dictionary
                const options_dict = {};
                for (const option of option_list) {
                    if (option.length > 1) {
                        options_dict[option[0]] = option.slice(2);
                    }
                }
    
    
                const questionObj = {
                    question_no: parseInt(q_no),
                    question: question.trim(),
                    options: options_dict,
                    correct: answer
                };
    
                // Add the object element to Q_list
                Q_list.push(questionObj);
    
                // console.log(list_element);
            } catch (error) {
                console.error('Error parsing part:', part);
            }
        }
    }
    return Q_list
}








app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
