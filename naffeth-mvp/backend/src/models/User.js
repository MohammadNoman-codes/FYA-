const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db'); // Import sequelize instance

class User extends Model {
  // Method to compare entered password with hashed password in DB
  async matchPassword(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please add a name' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'User already exists', // More specific message handled in controller
    },
    validate: {
      isEmail: { msg: 'Please add a valid email' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters long',
      },
    },
    // Note: Hashing is done via hooks below.
    // To prevent password from being returned by default:
    // Add 'defaultScope' and 'scopes' here or handle in queries.
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher', 'admin'),
    defaultValue: 'student',
    allowNull: false,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  // createdAt and updatedAt are handled automatically by Sequelize
}, {
  sequelize, // We need to pass the connection instance
  modelName: 'User',
  timestamps: true, // Enable timestamps
  defaultScope: { // Exclude password by default
    attributes: { exclude: ['password'] },
  },
  scopes: { // Define a scope to include password when needed
    withPassword: {
      attributes: {},
    }
  },
  hooks: {
    // Encrypt password using bcrypt before creating/updating
    beforeSave: async (user, options) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

module.exports = User;
