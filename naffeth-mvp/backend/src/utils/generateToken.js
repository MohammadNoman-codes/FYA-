const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../../.env' }); // Adjust path if needed

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken;
