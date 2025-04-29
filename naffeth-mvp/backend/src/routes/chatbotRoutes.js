const express = require('express');
const { sendMessage } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware'); // Protect the route

const router = express.Router();

// Route for sending a message to the chatbot
// Ensure this handles POST requests to /message relative to the base path defined in server.js
router.route('/message')
    .post(protect, sendMessage); // Only logged-in users can use the chatbot

module.exports = router;
