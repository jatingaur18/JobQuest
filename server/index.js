const express = require('express');
const cors = require('cors');
const port = 3000;

const loginRoute = require('./routes/login');
const signupRoute = require('./routes/signup');
const createjobRoute = require('./routes/createjob');
const gettestRoute = require('./routes/gettest');
const jobsRoute = require('./routes/jobs');
const jobstatusRoute = require('./routes/jobstatus');
const uploadresumeRoute = require('./routes/uploadresume');
const applyjobRoute = require('./routes/applyjob');
const companyRoute = require('./routes/company');
const uploadedResumes = require('./routes/uploadedResumes');

const {connectToDatabase} = require('./utils');

let db;
let bucket;

connectToDatabase();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/company', companyRoute);
app.use('/createjob', createjobRoute);
app.use('/applyjob', applyjobRoute);
app.use('/uploadresume', uploadresumeRoute);
app.use('/jobs', jobsRoute);
app.use('/jobstatus', jobstatusRoute);
app.use('/gettest', gettestRoute);
app.use('/uploadedResumes', uploadedResumes);


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})