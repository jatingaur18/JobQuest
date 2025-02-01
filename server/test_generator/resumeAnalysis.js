const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
dotenv.config();

// Validate API key
const GOOGLE_API_KEY = process.env.KEY;
if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set in environment variables');
}

/**
 * Parse the AI response into a structured object
 * @param {string} responseText - Raw text response from the AI
 * @returns {Object} Structured analysis output
 */
const parseResponseToJson = (responseText) => {
    const jsonOutput = {};
    
    try {
        // Extract resume score
        const scoreMatch = responseText.match(/Resume Score:\s*(\d+)/);
        jsonOutput.resume_score = scoreMatch ? parseInt(scoreMatch[1]) : null;

        // Extract sections
        const sections = {};
        const sectionPattern = /- (\w[\w\s]+):\s+[-]\s+Rating:\s*(\d+)\s+[-]\s+Strengths:\s*([^\n]*)\s+[-]\s+Weaknesses:\s*([^\n]*)\s+[-]\s+Improvements:\s*([^\n]*)/g;
        let match;

        while ((match = sectionPattern.exec(responseText)) !== null) {
            const sectionName = match[1].trim().replace(/\s+/g, '_').toLowerCase();
            sections[sectionName] = {
                rating: parseInt(match[2]),
                strengths: match[3].split(',').map(s => s.trim()).filter(Boolean),
                weaknesses: match[4].split(',').map(w => w.trim()).filter(Boolean),
                improvements: match[5].split(',').map(i => i.trim()).filter(Boolean)
            };
        }

        jsonOutput.sections = sections;

        // Extract missing sections
        const missingSectionsMatch = responseText.match(/Missing Sections:\s*(.*)/);
        jsonOutput.missing_sections = missingSectionsMatch
            ? missingSectionsMatch[1].split(',').map(ms => ms.trim()).filter(Boolean)
            : [];

        return jsonOutput;

    } catch (error) {
        console.error('Error parsing response:', error);
        return null;
    }
};

/**
 * Analyzes a resume and provides structured feedback
 * @param {string} resumePath - Path to the PDF resume file
 * @returns {Promise<Object>} Structured analysis of the resume
 */
const analyze_Resume = async (resumePath = path.join(__dirname, '../resume.pdf')) => {
    try {
        // Initialize Gemini AI
        const genai = new GoogleGenerativeAI(GOOGLE_API_KEY);
        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        // Read and extract text from PDF
        const dataBuffer = await fs.readFile(resumePath);
        const pdfData = await pdfParse(dataBuffer);
        const resumeText = pdfData.text;

        if (!resumeText.trim()) {
            throw new Error('Failed to extract text from resume PDF');
        }

        // Construct the query and context
        const descQuery = `Analyze the provided resume and evaluate its quality. Provide a score, section-wise analysis, and missing sections as per the specified format.\n${resumeText}`;
        
        const context = `**Output Format**:  
Return the analysis as a string with the following structure. Use clear identifiers for each section:

1. Resume Score: [Overall score out of 100]
2. Sections:
   - Contact Information:
       - Rating: [Score out of 10]
       - Strengths: [Comma-separated strengths]
       - Weaknesses: [Comma-separated weaknesses]
       - Improvements: [Comma-separated improvements]
   - Skills:
       - Rating: [Score out of 10]
       - Strengths: [Comma-separated strengths]
       - Weaknesses: [Comma-separated weaknesses]
       - Improvements: [Comma-separated improvements]
   - [Other sections...]

3. Missing Sections: [Comma-separated missing sections]

Return only the output as described. Do not include anything else.`;

        // Generate response using Gemini
        const result = await model.generateContent(descQuery + context);
        
        if (!result || !result.response) {
            throw new Error('No response received from AI model');
        }

        // Get the response text and parse it
        const responseText = await result.response.text();
        const analysisResult = parseResponseToJson(responseText);

        if (!analysisResult) {
            throw new Error('Failed to parse AI response');
        }

        return analysisResult;

    } catch (error) {
        console.error('Error in resume analysis:', error);
        throw error;
    }
}

module.exports = { analyze_Resume };