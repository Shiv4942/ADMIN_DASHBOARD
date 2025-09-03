const mongoose = require('mongoose');

const learningMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  timeSpent: {
    value: {
      type: Number,
      default: 0,
      min: 0
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'hours'
    }
  },
  effectiveness: {
    type: String,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search
learningMethodSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('LearningMethod', learningMethodSchema);
