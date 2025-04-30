const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import Google AI SDK
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Initialize Google AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Use Gemini API Key

// @desc    Send message to Google Gemini API
// @route   POST /api/chatbot/message
// @access  Private (Requires user to be logged in)
exports.sendMessage = async (req, res, next) => {
    const { message } = req.body;
    const userId = req.user.id; // User ID for potential context/logging

    if (!message) {
        return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    // Check for Gemini API Key
    if (!process.env.GEMINI_API_KEY) {
         console.error('GEMINI_API_KEY is not defined in environment variables.');
        return res.status(500).json({ success: false, message: 'Chatbot service is not configured.' });
    }

    try {
        // Define the role and instructions for the chatbot (Adjust for Gemini if needed)
        const systemInstructions = `You are Naffeth Assistant, a helpful AI tutor 
        integrated into the Naffeth gamified learning platform. 
        Your goal is to assist students with their learning, answer questions about courses 
        (like IoT, AI, Programming, Electronics, Robotics), 
        explain concepts, and provide encouragement. Keep responses concise, friendly, 
        and educational. Avoid generating harmful, unethical, or irrelevant content. 
        You are talking to user ID: ${userId}.`;

        // Use a current and valid model name like 'gemini-1.5-flash-latest'
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

        // Construct the prompt including system instructions and user message
        // Gemini's basic chat doesn't have a separate 'system' role like OpenAI.
        // We prepend the instructions to the user's message or use chat history structure.
        // Simple approach: Combine instructions and message.
        const fullPrompt = `${systemInstructions}\n\nUser Question: ${message}`;

        // Generate content
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const reply = response.text() || "Sorry, I couldn't get a response. Please try again.";

        res.status(200).json({ success: true, reply: reply });

    } catch (error) {
        console.error('Google Gemini API request error:', error);
        // Provide a generic error message to the client
        // Gemini errors might have different structures, adjust as needed
        let errorMessage = 'Error communicating with the chatbot service.';
        // Add specific Gemini error handling if necessary based on observed errors
        // Example: Check error.message or error.code if available
        if (error.message && error.message.includes('API key not valid')) {
             errorMessage = 'Chatbot authentication failed. Please check the API key.';
        } else if (error.message && error.message.includes('quota')) {
             errorMessage = 'Chatbot service quota exceeded. Please check your plan.';
        }

        res.status(500).json({ success: false, message: errorMessage });
    }
};
