const express = require('express');
const { submitQuiz, createQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Note: mergeParams is not strictly needed if lessonId is passed in the body for creation
const router = express.Router();

// Route for submitting a specific quiz
router.route('/:quizId/submit')
    .post(protect, submitQuiz);

// Route for creating a quiz (expects lessonId in body)
router.route('/')
    .post(protect, authorize('admin', 'teacher'), createQuiz);

module.exports = router;
