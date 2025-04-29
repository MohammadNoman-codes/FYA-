const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Define the path for the SQLite database file
const storagePath = path.resolve(__dirname, '../../naffeth_mvp.sqlite');

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false, // Disable logging SQL queries or set to console.log for debugging
});

// Function to test the connection and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Connection has been established successfully.');

    // Sync all defined models to the DB.
    // Use { force: true } or { alter: true } cautiously during development
    // await sequelize.sync({ alter: true }); // Use alter: true to update tables based on model changes
    // console.log("All models were synchronized successfully.");

  } catch (error) {
    console.error('Unable to connect to the SQLite database:', error);
    process.exit(1); // Exit process with failure
  }
};

// Export the sequelize instance and the connection function
module.exports = { sequelize, connectDB };
