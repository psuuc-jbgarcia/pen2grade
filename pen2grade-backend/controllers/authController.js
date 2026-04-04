const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Server-side password validation
    const hasMinLength = password && password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);

    if (!hasMinLength || !hasUppercase) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long and contain at least one uppercase letter.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt: ${email}`);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[AUTH] User not found: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingSeconds = Math.ceil((user.lockUntil - Date.now()) / 1000);
      const remainingMinutes = Math.ceil(remainingSeconds / 60);
      console.log(`[AUTH] User ${email} is LOCKED for ${remainingSeconds}s`);
      return res.status(403).json({ 
        message: `Account temporarily locked due to 5 failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}.`,
        isLocked: true,
        remainingSeconds
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      console.log(`[AUTH] Failed login for ${email}. Total attempts: ${user.loginAttempts}`);
      
      // If 5 or more attempts, lock the account for 5 minutes
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 5 * 60 * 1000);
        console.log(`[AUTH] LOCKING account ${email} until ${user.lockUntil.toISOString()}`);
        await user.save();
        return res.status(403).json({ 
          message: 'Account locked due to 5 failed attempts. Please try again after 5 minutes.',
          isLocked: true,
          remainingSeconds: 300
        });
      }
      
      await user.save();
      const remainingAttempts = 5 - user.loginAttempts;
      return res.status(401).json({ 
        message: `Invalid credentials. ${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before lockout.`,
        remainingAttempts
      });
    }

    // Successful login: reset attempts and lockout
    console.log(`[AUTH] Login SUCCESS for ${email}. Resetting attempts.`);
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Create and assign a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_if_env_fails',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('[AUTH] Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Calculate standard AI Check usages
    const today = new Date().toDateString();
    let count = user.aiCheckCount || 0;
    if (!user.lastAiCheckDate || user.lastAiCheckDate.toDateString() !== today) {
      count = 0;
    }
    
    // Calculate Camera Scan usages
    let cameraCount = user.cameraScanCount || 0;
    if (!user.lastCameraScanDate || user.lastCameraScanDate.toDateString() !== today) {
      cameraCount = 0;
    }
    
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      usage: {
        count: count,
        limit: 10,
        remaining: Math.max(0, 10 - count)
      },
      cameraScanUsage: {
        count: cameraCount,
        limit: 3,
        remaining: Math.max(0, 3 - cameraCount)
      }
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({ message: 'Server error fetching user details' });
  }
};
