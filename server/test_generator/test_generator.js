const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const fs = require('fs').promises;


dotenv.config();


/**
 * @param {string} resumePath - Path to the PDF resume file
 * @param {string} jobDescription - Path to the job description file
 * @returns {Promise<number>} Compatibility score between 0 and 100
 */
const test_gen = async (jobDescription) => {
    try {
        // Initialize Gemini AI
        const genai = new GoogleGenerativeAI(process.env.KEY);
        const model = genai.getGenerativeModel({ model: 'gemini-pro' });

        const descQuery = `give 5 extremely difficult technical mcq questions for the person we are looking to hire based on the following job description ${jobDescription}`;
        const question = "Give me 5 extremely difficult python mcq questions"
        const context = "(with question number) separate each question with !@#ques (print this separator just before question number) \
        and separate questions from options from question with !@#opt (print the options like a), b) ) and print correct answer \
        after the options with !@#ans"
        // Generate response using Gemini
        const result = await model.generateContent(descQuery+context);
        
        // Check if response exists and has content
        if (!result || !result.response) {
            throw new Error('No response received from AI model');
        }

        // Get the response text
        const responseText = await result.response.text();
        
        if (!responseText) {
            throw new Error('Empty response received from AI model');
        }
        return responseText;

    } catch (error) {
        console.error('Error in resume evaluation:', error);
        throw error;
    }
};

module.exports = { test_gen };

