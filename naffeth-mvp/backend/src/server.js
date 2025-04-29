const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // <-- Import path module
const { sequelize, connectDB } = require('./config/db'); // Import sequelize instance and connectDB

// Load env vars
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

// Import Models
const User = require('./models/User');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const { Quiz, Question, Option } = require('./models/Quiz'); // Import Quiz related models

// Define Associations
Course.hasMany(Lesson, { foreignKey: 'courseId', onDelete: 'CASCADE' }); // If a course is deleted, delete its lessons
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

Lesson.hasOne(Quiz, { foreignKey: 'lessonId', onDelete: 'CASCADE' }); // If a lesson is deleted, delete its quiz
Quiz.belongsTo(Lesson, { foreignKey: 'lessonId' });

// Note: Quiz <-> Question <-> Option associations are defined within Quiz.js

// Function to add dummy data
const addDummyData = async () => {
  try {
    // Check if courses already exist
    const courseCount = await Course.count();
    if (courseCount === 0) {
      console.log('No courses found, adding dummy data...');
      // --- Use relative paths for consistency ---
      await Course.bulkCreate([
        // Use a consistent relative path, even if just a placeholder now
        { title: 'Introduction to IoT', description: 'Learn the basics of the Internet of Things, sensors, and communication.', level: 7, category: 'IoT', imageUrl: '/images/iot-course.jpg' },
        { title: 'AI Fundamentals', description: 'Explore core concepts of Artificial Intelligence and Machine Learning.', level: 9, category: 'AI', imageUrl: '/images/ai-fundamentals.jpg' },
        { title: 'Python for Beginners', description: 'Start your programming journey with Python, a versatile language.', level: 8, category: 'Programming', imageUrl: '/images/python-beginners.jpg' },
        { title: 'Basic Electronics', description: 'Understand circuits, components like resistors, capacitors, and transistors.', level: 7, category: 'Electronics', imageUrl: '/images/basic-electronics.jpg' },
        { title: 'Robotics 101', description: 'An introduction to building and programming simple robots.', level: 10, category: 'Robotics', imageUrl: '/images/robotics-101.jpg' },
        { title: 'Web Development Basics', description: 'Learn the fundamentals of HTML, CSS, and JavaScript.', level: 8, category: 'Programming', imageUrl: '/images/web-dev-basics.jpg' },
        { title: 'Advanced AI Techniques', description: 'Dive deeper into neural networks, deep learning, and NLP.', level: 14, category: 'AI', imageUrl: '/images/advanced-ai.jpg' },
      ]);
      console.log('Dummy courses created with relative image paths.');
    } else {
      console.log('Courses already exist, skipping dummy data creation.');
    }
    // Add dummy data for other models (Lessons, Quizzes) here if needed
  } catch (error) {
    console.error('Error adding dummy data:', error);
  }
};


// Connect to database and sync models
const startServer = async () => {
  await connectDB();
  // Use { force: true } ONLY if you want to drop tables and recreate (e.g., during initial dev)
  // Use { alter: true } to modify tables based on model changes
  await sequelize.sync({ alter: true }); // Consider removing alter:true after initial setup
  console.log("All models were synchronized successfully.");

  // Add dummy data after syncing
  await addDummyData(); // This will now use relative paths

  // Route files
  const authRoutes = require('./routes/auth');
  const courseRoutes = require('./routes/courses');
  const quizRoutes = require('./routes/quizzes');
  const chatbotRoutes = require('./routes/chatbotRoutes'); // <-- Make sure this line exists

  const app = express();

  // Body parser middleware
  app.use(express.json());

  // Enable CORS
  app.use(cors());

  // --- Add Static File Serving ---
  // Serve static files (like images) from the 'public' directory
  app.use(express.static(path.join(__dirname, 'public')));
  // Now requests to http://localhost:5000/images/your-image.jpg will serve the file
  // from d:\UAE Hackathon\naffeth-mvp\backend\public\images\your-image.jpg

  // Define Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes); // Includes GET /lessons/:lessonId via courseController
  app.use('/api/quizzes', quizRoutes); // Handles quiz submission and creation
  app.use('/api/chatbot', chatbotRoutes); // <-- Make sure this line exists and uses the correct variable

  // If you still want POST /api/lessons/:lessonId/quizzes, you'd need a separate router or adjust quizRoutes/quizController
  // Example: const lessonQuizRouter = require('./routes/lessonQuizzes');
  // app.use('/api/lessons/:lessonId/quizzes', lessonQuizRouter);

  app.get('/', (req, res) => res.send('Naffeth API Running'));

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();
