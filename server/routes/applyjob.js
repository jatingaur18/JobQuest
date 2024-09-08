const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
    const applydata = req.body;
    const { test_id, resume, user } = applydata;
    
    try {
        // Ensure test_id is a valid ObjectId string, otherwise it will throw an error
        if (!ObjectId.isValid(test_id)) {
            return res.status(400).json({ message: 'Invalid test ID format' });
        }

        const jobs = await db.collection('jobs').findOne({ _id: new ObjectId(test_id) });
        if (!jobs) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const score = applydata.score;
        const pushData = {
            email: user.email,
            name: user.username,
            score: score,
            link: "link-to-resume"
        };

        await db.collection('jobs').updateOne(
            { _id: new ObjectId(test_id) },
            { $push: { participants: pushData } }
        );

        res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Error processing job application', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
