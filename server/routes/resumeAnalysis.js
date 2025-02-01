const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/JWTauth');
const { analyze_Resume } = require('../test_generator/resumeAnalysis.js');

async function analyzeResume() {
    try {
        let jsonOutput;
        let t = 5;
        while (t--) {
            // Run the Python program and get the output
            const pythonOutput = await analyze_Resume();
            console.log('Python Output:', pythonOutput);

            // Check if Sections is not empty
            if (pythonOutput.sections && Object.keys(pythonOutput.sections).length > 0) {
                return pythonOutput; // Return the output if Sections is not empty
            }

            console.log('Sections is empty, retrying...');
        }
        throw new Error('Failed to process resume analysis.');
    } catch (error) {
        console.error('Error analyzing resume:', error);
        throw new Error('Failed to process resume analysis.');
    }
}

router.post('/', authenticateToken, async (req, res) => {
    const applydata = req.body;
    const user = applydata.user;
    const authuser = req.user;
    console.log("user ", authuser);

    if (user.email !== authuser.email && user.username !== authuser.username) {
        return res.status(505).json({ message: 'Token failure' });
    }

    const fileUrl = applydata.resume;

    try {
        const response = await fetch('http://localhost:3000/downloadResume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ resume: fileUrl }),
        });

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Failed to download resume' });
        }

        // Proceed with resume analysis
        const result = await analyzeResume();
        console.log('Resume Analysis Result:', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'An error occurred while processing the resume', error: error.message });
    }
});

module.exports = router;
