const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists (Sequelize handles unique constraint, but good practice to check)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user (password hashing handled by hook in model)
    const user = await User.create({
      name,
      email,
      password,
      role, // Role can be optionally provided, defaults to 'student'
    });

    // Generate token and send response (user object excludes password by default scope)
    const token = generateToken(user.id); // Use user.id
    res.status(201).json({ success: true, token });

  } catch (error) {
    console.error('Registration error:', error);
    // Handle validation errors from Sequelize
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password were entered
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Check for user, including the password using the defined scope
    const user = await User.scope('withPassword').findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches using the instance method
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token and send response
    const token = generateToken(user.id);
    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private (Requires authentication middleware)
exports.getMe = async (req, res, next) => {
    // req.user is populated by the protect middleware (should be a Sequelize User instance)
    try {
        // User data (excluding password) is already attached to req.user by middleware
        if (!req.user) {
             return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: req.user });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
