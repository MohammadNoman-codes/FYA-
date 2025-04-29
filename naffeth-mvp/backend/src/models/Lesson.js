const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Lesson extends Model {}

Lesson.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a lesson title' },
    },
  },
  content: {
    type: DataTypes.TEXT, // Use TEXT for potentially long content
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add lesson content' },
    },
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null if no video
    validate: {
        isUrl: { msg: 'Please provide a valid video URL' } // Optional: validate URL format
    }
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'Order must be an integer' },
      min: { args: [1], msg: 'Order must be at least 1' },
    },
  },
  // courseId foreign key added via association
  // quizId foreign key added via association
}, {
  sequelize,
  modelName: 'Lesson',
  timestamps: true,
});

module.exports = Lesson;
