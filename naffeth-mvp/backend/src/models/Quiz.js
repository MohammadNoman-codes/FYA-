const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Quiz extends Model {}

Quiz.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pointsAwarded: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    allowNull: false,
  },
  // lessonId foreign key added via association
  // questions association defined below
}, {
  sequelize,
  modelName: 'Quiz',
  timestamps: true,
});

// Define Question and Option models (related to Quiz)
class Question extends Model {}
Question.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    questionText: { type: DataTypes.STRING, allowNull: false }
    // quizId foreign key added via association
}, { sequelize, modelName: 'Question', timestamps: false }); // No separate timestamps needed usually

class Option extends Model {}
Option.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text: { type: DataTypes.STRING, allowNull: false },
    isCorrect: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    // questionId foreign key added via association
}, { sequelize, modelName: 'Option', timestamps: false });

// Define associations
Quiz.hasMany(Question, { foreignKey: 'quizId', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

Question.hasMany(Option, { foreignKey: 'questionId', onDelete: 'CASCADE' });
Option.belongsTo(Question, { foreignKey: 'questionId' });


module.exports = { Quiz, Question, Option }; // Export all related models
