const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'teacher'
  },
  aiCheckCount: {
    type: Number,
    default: 0
  },
  lastAiCheckDate: {
    type: Date,
    default: null
  },
  cameraScanCount: {
    type: Number,
    default: 0
  },
  lastCameraScanDate: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'usersacc');
