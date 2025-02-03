const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const authenticateToken = require('../middleware/JWTauth');
const { evaluateResume } = require('../test_generator/resume_scorer.js');


router.post('/', authenticateToken, async (req, res) => {
    const applydata = req.body;
    const { score, resume, test_id, user } = applydata;
    const authuser = req.user;
    if (user.email !== authuser.email || user.username !== authuser.id) {
        res.status(505).json({ message: 'token failure' });
    }
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
            body: JSON.stringify({ resume: resume.path }),
        });

        const job_desc = jobs.description;
        const resumeScore = await evaluateResume(job_desc);
        console.log(resumeScore)

        if (isNaN(resumeScore)) {
            return res.status(500).json({ message: 'Invalid score returned from evaluation function' });
        }

        // Calculate the average score
        const updatedScore = (score) * 2 + (resumeScore * 9) / 10;

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
    } catch (error) {
        console.error('Error processing job application', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
