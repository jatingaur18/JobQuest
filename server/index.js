const express = require('express');
const cors = require('cors');
const http = require('http');
const port = 3000;
const WebSocket = require('ws');

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
const downloadResume = require('./routes/downloadResume');
const resumeAnalysis = require('./routes/resumeAnalysis');
const updateProfile = require('./routes/updateProfile') 
const fetchProfile = require('./routes/fetchProfile')
const fetchChat = require('./routes/fetchChat')
const fetchChatList = require('./routes/fetchChatList')
const Message = require('./routes/message')

const {connectToDatabase} = require('./utils');

let db;
let bucket;

connectToDatabase();

const app = express();
const { Server } = require('socket.io');
//video call
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
//

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
app.use('/downloadResume', downloadResume);
app.use('/uploadedResumes', uploadedResumes);
app.use('/resumeAnalysis', resumeAnalysis);
app.use('/updateProfile',updateProfile)
app.use('/fetchProfile',fetchProfile)
app.use('/fetchChat',fetchChat)
app.use('/fetchChatList',fetchChatList)
app.use('/Message',Message)

// calls
// Store connected clients
const clients = new Set();
const rooms = {}; // Store roomId -> Set of clients

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      const { roomId } = data;
  
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
  
      if (!rooms[roomId].includes(ws)) {
        rooms[roomId].push(ws);
      }
  
      // Broadcast message to everyone in the room except sender
      rooms[roomId].forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
  
      // Cleanup on disconnect
      ws.on('close', () => {
        rooms[roomId] = rooms[roomId].filter(client => client !== ws);
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
        }
      });
    });
  });


server.listen(port, () => {
  console.log(`listening on port ${port}`)
})