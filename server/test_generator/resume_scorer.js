const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();

/**
 * Evaluates a resume against a job description using Google's Gemini AI
 * @param {string} resumePath - Path to the PDF resume file
 * @param {string} jobDescription - Path to the job description file
 * @returns {Promise<number>} Compatibility score between 0 and 100
 */
const evaluateResume = async (jobDescription) => {
    try {
        const resumePath = path.join(__dirname, '../resume.pdf')
        // Initialize Gemini AI
        const genai = new GoogleGenerativeAI(process.env.KEY);
        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        // Read and extract text from PDF
        const dataBuffer = await fs.readFile(resumePath);
        const pdfData = await pdfParse(dataBuffer);
        const resumeText = pdfData.text;

        // Read job description
        // const jobDesc = await fs.readFile(jobDescription, 'utf-8');

        // Save job description to file (if needed)
        // await fs.writeFile('jobquery.txt', jobDescription);

        // Construct the evaluation prompt
        const descQuery = `Evaluate the following resume based on the job description and provide a compatibility score \
between 0 and 100 as an integer.\n\n\
Only give scores above 70 if the resume is an exceptionally good match and below 30 if it is clearly unqualified.\n\n\
Job Description:\n${jobDescription}\n\n\
Resume:\n${resumeText}\n\n\
Scoring Scale:\n\
- 90-100: Strong match with all skills, experience, and education requirements.\n\
- 70-89: Good match with most skills and experience but minor gaps.\n\
- 50-69: Moderate match with some relevant skills or experience but noticeable gaps.\n\
- 30-49: Weak match with few relevant skills or experience.\n\
- 0-29: Very poor match, lacks required skills and experience.\n\n\
Score: (Please provide the average score as a single integer without any additional text)\
please provide only the score and do not provide any other description`;

        // Generate response using Gemini
        const result = await model.generateContent(descQuery);
        
        // Check if response exists and has content
        if (!result || !result.response) {
            throw new Error('No response received from AI model');
        }

        // Get the response text
        const responseText = await result.response.text();
        
        if (!responseText) {
            throw new Error('Empty response received from AI model');
        }

        // Validate and parse the score
        const score = parseInt(responseText.trim(), 10);
        if (isNaN(score) || score < 0 || score > 100) {
            throw new Error('Invalid score received from AI model');
        }

        return score;

    } catch (error) {
        console.error('Error in resume evaluation:', error);
        throw error;
    }
};

module.exports = { evaluateResume };

