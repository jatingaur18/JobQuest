const express = require('express')
const router = express.Router()
const authenticateToken = require('../middleware/JWTauth');
const {analyze_Resume} = require('../test_generator/resumeAnalysis.js')

async function analyzeResume() {
    try {
      let jsonOutput;

      let t=5;
      while (t--) {
        // Run the Python program and get the output
        const pythonOutput = await analyze_Resume();
        console.log('Python Output:', pythonOutput);
  
        // Parse the output into JSON
        // jsonOutput = JSON.parse(pythonOutput);
  
        // Check if Sections is not empty
        if (pythonOutput.sections && Object.keys(pythonOutput.sections).length > 0) {
          return pythonOutput;
          break; // Exit the loop if Sections is not empty
        }
  
        console.log('Sections is empty, retrying...');
      }
  
      // Return the JSON object
    } catch (error) {
      console.error('Error analyzing resume:', error);
      throw new Error('Failed to process resume analysis.');
    }
  }


  


router.post('/',authenticateToken, async (req, res) => {
    const applydata = req.body;
    const user= applydata.user;
    const authuser= req.user;
    console.log("user ",authuser)
    if(user.email !==authuser.email && user.username !==authuser.username){
        res.status(505).json({message:'token faliure'});
    }
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
      