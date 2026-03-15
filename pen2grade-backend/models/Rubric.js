const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  description: {
    type: String,
    trim: true
  }
});

const rubricSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  criteria: [criteriaSchema],
  totalWeight: {
    type: Number,
    default: 100
  }
}, { timestamps: true });

// Ensure total weight equals 100 on save
rubricSchema.pre('save', function(next) {
  const sum = this.criteria.reduce((acc, curr) => acc + curr.weight, 0);
  this.totalWeight = sum;
  next();
});

module.exports = mongoose.model('Rubric', rubricSchema);
