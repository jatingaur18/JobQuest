const express = require('express')
const { spawn } = require('child_process');
const router = express.Router()
const { exec } = require('child_process');



async function executePythonone(scriptPath, description) {
    return new Promise((resolve, reject) => {
        const command = `python ${scriptPath} "${description}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${stderr}`);
                reject(error);
                return;
            }

            resolve(stdout.trim());
        });
    });
}



async function analyzeResume() {
    try {
      let jsonOutput;

      let t=5;
      while (t--) {
        // Run the Python program and get the output
        const pythonOutput = await executePythonone('./test_generator/resumeAnalysis.py', './resume.pdf');
        console.log('Python Output:', pythonOutput);
  
        // Parse the output into JSON
        jsonOutput = JSON.parse(pythonOutput);
  
        // Check if Sections is not empty
        if (jsonOutput.sections && Object.keys(jsonOutput.sections).length > 0) {
          break; // Exit the loop if Sections is not empty
        }
  
        console.log('Sections is empty, retrying...');
      }
  
      // Return the JSON object
      return jsonOutput;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to process resume analysis.');
    }
  }


  


router.post('/', async (req, res) => {
    const applydata = req.body;
    const fileUrl = applydata.resume;
    const response = await fetch('http://localhost:3000/downloadResume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({resume: fileUrl}),
    });
    analyzeResume()
        .then((result) => {
            console.log('Resume Analysis Result:', result);
            res.status(200).json(result);
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
})
      
module.exports = router;
      