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

module.exports = {
  connectToDatabase: connectToDatabase,
}
