const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Authenticated users)
exports.getProjects = async (req, res, next) => {
  try {
    // Optional: Add pagination later
    const projects = await Project.findAll({
        order: [['createdAt', 'DESC']] // Show newest first
    });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    console.error('Get Projects error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Authenticated users)
exports.createProject = async (req, res, next) => {
  const { name, description, competitionName, category } = req.body;
  // Optional: Get userId if associating projects with users
  // const userId = req.user.id;

  try {
    const project = await Project.create({
      name,
      description,
      competitionName,
      category,
      // userId // Add userId here if associating
    });
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('Create Project error:', error);
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(400).json({ success: false, message: error.message || 'Error creating project' });
  }
};
