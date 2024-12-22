const express = require('express')
const multer = require('multer');
const os = require('os');
const router = express.Router()
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
// const upload = multer({ dest: os.tmpdir() });

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'resumes', // Folder name in Cloudinary
      resource_type: 'raw', // Detect file type automatically
  },
});

const upload = multer({ storage });

// Endpoint for file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const resume = await db.collection('resume');
    resume.insertOne({
      email: req.headers.email,
      filename: req.file.originalname,
      path: req.file.path
    });
    console.log(req.file.path);
      res.status(200).json({
          message: 'File uploaded successfully',
          fileUrl: req.file.path, // URL of the uploaded file
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to upload file' });
  }
});




// router.post('/', upload.single('resume'), async (req, res) => {
//   const fs = require('fs');

//   fs.writeFileSync('./myFile', req.file.toString());

//   try{
//     await fs.createReadStream('./myFile').
//       pipe(bucket.openUploadStream(`${req.headers.email}_${req.file.originalname}`));
//     console.log("Resume uploaded successfully");
//   }catch(e){
//     console.log("Error occured while uploading resume", e);
//     return res.status(500).send("Internal Server Error");
//   }

//   res.status(200).send("done");
// })

module.exports = router;
