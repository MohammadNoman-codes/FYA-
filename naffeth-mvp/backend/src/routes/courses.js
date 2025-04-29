const express = require('express');
const {
    getCourses,
    getCourse,
    getLesson, // Import getLesson
    createCourse, // Import admin functions
    createLesson  // Import admin functions
} = require('../controllers/courseController');

// Include other resource routers if needed (e.g., for quizzes related to lessons)
// const quizRouter = require('./quizzes'); // Example for later

const router = express.Router();

// Mount other resource routers
// router.use('/:lessonId/quizzes', quizRouter); // Example: /api/lessons/:lessonId/quizzes/...

// --- Public Routes ---
router.route('/')
    .get(getCourses)
    .post(createCourse); // Add POST for creating courses (admin later)

router.route('/:courseId')
    .get(getCourse);
    // Add PUT/DELETE later for admin

router.route('/:courseId/lessons') // Route for creating lessons within a course
    .post(createLesson); // Add POST for creating lessons (admin later)

// --- Lesson Specific Route ---
// Note: It might be cleaner to have a separate /api/lessons route file
// but for simplicity in MVP, keeping it here.
router.route('/lessons/:lessonId') // Changed route to avoid conflict
    .get(getLesson);
    // Add PUT/DELETE later for admin

module.exports = router;
