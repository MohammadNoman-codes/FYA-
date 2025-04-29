const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const { Quiz, Question, Option } = require('../models/Quiz'); // Import Quiz related models

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (for MVP)
exports.getCourses = async (req, res, next) => {
  try {
    // Basic query, exclude lessons association for list view
    const courses = await Course.findAll({
        // attributes: { exclude: ['lessons'] } // Not needed if not including
    });
    res.status(200).json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    console.error('Get Courses error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single course with its lessons
// @route   GET /api/courses/:courseId
// @access  Public (for MVP)
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.courseId, {
        include: [{
            model: Lesson,
            // Remove 'description' as it doesn't exist on the Lesson model
            attributes: ['id', 'title', 'order'], // Select only existing fields
            // Sequelize automatically uses the alias 'Lessons' (pluralized model name)
            // or you can specify 'as: 'Lessons'' in the association definition
        }],
        order: [
            [Lesson, 'order', 'ASC'] // Order the included lessons
        ]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error('Get Course error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get single lesson details (including its quiz and questions/options)
// @route   GET /api/lessons/:lessonId  (Assuming this route is still desired)
// @access  Public (for MVP, maybe Private later)
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findByPk(req.params.lessonId, {
        include: [{
            model: Quiz,
            attributes: ['id', 'pointsAwarded'], // Select fields from Quiz
            include: [{ // Nested include for Questions
                model: Question,
                attributes: ['id', 'questionText'],
                include: [{ // Nested include for Options
                    model: Option,
                    attributes: ['id', 'text'] // Exclude isCorrect for student view
                }]
            }]
        }]
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Note: isCorrect is excluded via attributes selection above. No need to manually delete.

    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    console.error('Get Lesson error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// --- Admin/Teacher Routes ---

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin/Teacher)
exports.createCourse = async (req, res, next) => {
    // Add authorization check here later
    try {
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        console.error('Create Course error:', error);
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(400).json({ success: false, message: error.message || 'Error creating course' });
    }
};

// @desc    Create new lesson for a course
// @route   POST /api/courses/:courseId/lessons
// @access  Private (Admin/Teacher)
exports.createLesson = async (req, res, next) => {
    // Add authorization check here later
    const courseId = req.params.courseId;
    try {
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: `Course not found with id ${courseId}` });
        }

        // Add courseId to the lesson data before creating
        const lessonData = { ...req.body, courseId: courseId };
        const lesson = await Lesson.create(lessonData);

        res.status(201).json({ success: true, data: lesson });
    } catch (error) {
        console.error('Create Lesson error:', error);
         if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(400).json({ success: false, message: error.message || 'Error creating lesson' });
    }
};
