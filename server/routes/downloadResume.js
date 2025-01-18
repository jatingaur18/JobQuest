const express = require('express');
const router = express.Router();
const fs = require('fs');
const http = require('https');
const path = require('path');

router.post('/', async (req, res) => {
    const applydata = req.body;
    const resume = applydata.resume; // URL of the resume to be downloaded
    console.log('Received applydata:', applydata);

    try {
        if (!resume || typeof resume !== 'string') {
            return res.status(400).json({ message: 'Invalid resume URL' });
        }

        const destination = path.join(__dirname, '..', 'resume.pdf'); // File path to save the downloaded resume
        const file = fs.createWriteStream(destination);

        // Start downloading the file
        http.get(resume, (response) => {
            if (response.statusCode !== 200) {
                console.error('Failed to download file, status code:', response.statusCode);
                return res.status(response.statusCode).json({ message: 'Failed to download resume' });
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close(() => {
                    console.log('File downloaded successfully to:', destination);
                    res.status(200).json({ message: 'Resume downloaded successfully', path: destination });
                });
            });

            file.on('error', (err) => {
                console.error('Error writing file:', err);
                fs.unlink(destination, () => {}); // Remove partially written file
                res.status(500).json({ message: 'Error saving resume file' });
            });
        }).on('error', (err) => {
            console.error('Error downloading file:', err);
            res.status(500).json({ message: 'Error downloading resume' });
        });
    } catch (error) {
        console.error('Error processing job application:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
