const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Course extends Model {}

Course.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a course title' },
    },
  },
  description: {
    type: DataTypes.TEXT, // Use TEXT for longer descriptions
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a description' },
    },
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Level must be an integer' },
      min: { args: [7], msg: 'Level must be at least 7' },
      max: { args: [15], msg: 'Level must be at most 15' }, // Example range
    },
  },
  category: {
    type: DataTypes.ENUM('IoT', 'AI', 'Programming', 'Electronics', 'Automation', 'Robotics'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['IoT', 'AI', 'Programming', 'Electronics', 'Automation', 'Robotics']],
        msg: 'Please specify a valid category',
      },
    },
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Allow courses without images initially
    validate: {
      isUrl: { msg: 'Please provide a valid image URL' } // Optional: validate URL format
    }
  },
  // lessons association defined below
}, {
  sequelize,
  modelName: 'Course',
  timestamps: true,
});

// Define associations after all models are defined
// We'll do this in a central place or after importing all models in server.js/index.js
// For now, just export the model.
module.exports = Course;
