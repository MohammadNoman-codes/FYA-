const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
// Import authentication middleware
const { protect } = require('../middleware/authMiddleware'); // Import protect

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Add protect middleware

module.exports = router;
