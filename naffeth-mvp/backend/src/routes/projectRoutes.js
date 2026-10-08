const express = require('express');
const { getProjects, createProject } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware'); // Protect routes

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route('/')
    .get(getProjects)
    .post(createProject);

// Add routes for getting single project, updating, deleting later if needed
// router.route('/:projectId')
//     .get(getSingleProject)
//     .put(updateProject)
//     .delete(deleteProject);

module.exports = router;
