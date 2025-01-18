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
        const response = await fetch('http://localhost:3000/downloadResume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({resume: resume.path}),
        });
        const job_desc = jobs.description
        const command = `python test_generator/resume_scorer.py resume.pdf "${job_desc}"`;

        exec(command, async (error, stdout, stderr) => {
            if (error) {
                console.error('Error running Python script:', error);
                return res.status(500).json({ message: 'Error processing resume score' });
            }

            const resumeScore = parseFloat(stdout.trim());
            if (isNaN(resumeScore)) {
                return res.status(500).json({ message: 'Invalid score returned from Python script' });
            }

            // Calculate the average score
            const updatedScore = (score)*2 + (resumeScore*9)/10;

            // Push the new score to the participants array
            const pushData = {
                email: user.email,
                name: user.username,
                score: updatedScore,
                link: resume
            };

            await db.collection('jobs').updateOne(
                { _id: new ObjectId(test_id) },
                { $push: { participants: pushData } }
            );

            res.status(200).json({ message: 'Application submitted successfully', updatedScore });
        });
    } catch (error) {
        console.error('Error processing job application', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;