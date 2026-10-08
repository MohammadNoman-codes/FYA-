const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Project extends Model {}

// Define project categories - reuse from Course or define specific ones
const projectCategories = ['IoT', 'AI', 'Programming', 'Electronics', 'Automation', 'Robotics', 'Web', 'Mobile', 'Other'];

Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a project name' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a project description' },
    },
  },
  competitionName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add the competition name' },
    },
  },
  category: {
    type: DataTypes.ENUM(...projectCategories), // Use ENUM for predefined categories
    allowNull: false,
    validate: {
      isIn: {
        args: [projectCategories],
        msg: 'Please specify a valid category',
      },
    },
  },
  // Optional: Add userId later to associate with the creator
  // userId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true, // Or false if required
  //   references: {
  //     model: 'Users', // 'Users' is the table name
  //     key: 'id',
  //   }
  // }
}, {
  sequelize,
  modelName: 'Project',
  timestamps: true, // Add createdAt/updatedAt fields
});

module.exports = Project;
