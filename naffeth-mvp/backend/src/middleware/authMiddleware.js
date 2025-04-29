const jwt = require('jsonwebtoken');
const User = require('../models/User');
// Correct the path relative to authMiddleware.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Optional: Check for token in cookies if you implement cookie-based auth later
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route (no token)' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload using Sequelize's findByPk
    // User model's default scope excludes password
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized (user not found)' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('Token verification error:', err);
    // Handle specific JWT errors if needed (e.g., TokenExpiredError)
    return res.status(401).json({ success: false, message: 'Not authorized to access this route (token failed)' });
  }
};

// Grant access to specific roles (Example)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Ensure req.user exists before accessing its role property
    if (!req.user) {
         return res.status(403).json({ success: false, message: `User not found, authorization denied` });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};
