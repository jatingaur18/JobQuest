const express = require('express');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

// Endpoint for file upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Uploading the image to Cloudinary as a PDF
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'image',
      format: 'pdf',
      folder: 'resumes',
    });

    // Uploading the raw PDF file
    const pdf = await cloudinary.uploader.upload(filePath, {
      folder: 'resumes',
      resource_type: 'raw',
    });

    // Save file details to the database
    const resume = db.collection('resume');
    await resume.insertOne({
      email: req.headers.email,
      filename: req.file.originalname,
      path: pdf.secure_url,
      pdf: result.secure_url,
    });

    // Sending the success response with the file URL
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: result.secure_url,
    });
  } catch (error) {
    // Logging the error and sending a response
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
