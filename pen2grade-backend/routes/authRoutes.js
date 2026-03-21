const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/auth/me
// @desc    Get current user details and usage
// @access  Private
router.get('/me', protect, authController.getMe);

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', authController.register);

// @route   POST api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', authController.login);

module.exports = router;
