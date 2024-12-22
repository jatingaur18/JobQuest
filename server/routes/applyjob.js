const express = require('express');
const router = express.Router();
const { ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const http = require('https');


router.post('/', async (req, res) => {
    const applydata = req.body;
    const {score, resume, test_id, user } = applydata;
    console.log(applydata);
    
    try {
        if (!ObjectId.isValid(test_id)) {
            console.error("Invalid test ID format:", test_id);
            return res.status(400).json({ message: 'Invalid test ID format' });
        }

        const jobId = new ObjectId(test_id);
        console.log(jobId);
        const jobs = await db.collection('jobs').findOne({ _id: jobId });
        if (!jobs) {
            return res.status(404).json({ message: 'Job not found' });
        } else {
            console.log("Found job:", jobs);
        }
        const fileUrl = resume;
        const destination = 'C:/Users/hp/OneDrive/Desktop/desktop/projects/ATS/server/resume.pdf';

        const file = fs.createWriteStream(destination);

        http.get(fileUrl, (response) => {
        response.pipe(file);
            file.on('finish', () => {
              file.close(() => {
                    console.log('File downloaded successfully');
                });
            });
        }).on('error', (err) => {
            console.error('Error downloading file:', err);
            // fs.unlink(destination, () => {
            // });
        });

    //     const bucket = new GridFSBucket(db, { bucketName: 'resume.files' });

    // // Convert the fileId to an ObjectId if it's in string format
    // const objectId = new ObjectId("6767cf0f29d986f48759a673");

    // bucket.openDownloadStream(objectId).pipe(fs.createWriteStream('./resume12.pdf'));


        // Proceed with job description and Python script
        // const job_desc = jobs.description;
        // const pythonScript = path.join(__dirname, '../test_generator/resume_scorer.py');
        // const command = `python ${pythonScript} "../resume.pdf" "../jobdesc.pdf"`;

        // exec(command, async (error, stdout, stderr) => {
        //     if (error) {
        //         console.error('Error running Python script:', error);
        //         return res.status(500).json({ message: 'Error processing resume score' });
        //     }

        //     const resumeScore = parseFloat(stdout.trim());
        //     if (isNaN(resumeScore)) {
        //         return res.status(500).json({ message: 'Invalid score returned from Python script' });
        //     }

        //     // Calculate the average score
        //     const updatedScore = (score + resumeScore) / 2;

        //     // Push the new score to the participants array
        //     const pushData = {
        //         email: user.email,
        //         name: user.username,
        //         score: updatedScore,
        //         link: resume
        //     };

        //     await db.collection('jobs').updateOne(
        //         { _id: new ObjectId(test_id) },
        //         { $push: { participants: pushData } }
        //     );

        //     res.status(200).json({ message: 'Application submitted successfully', updatedScore });
        // });
    } catch (error) {
        console.error('Error processing job application', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
