const mongoose = require('mongoose');

const essaySchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rubric: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rubric',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String, // e.g., 'image', 'pdf', 'text'
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  extractedText: {
    type: String
  },
  aiFeedback: {
    type: Object // Will store the JSON response from the Python AI Service
  },
  totalScore: {
    type: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Essay', essaySchema);
