import mongoose from 'mongoose';

const learningMethodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
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
    default: 'Medium',
    set: function(value) {
      // Convert numeric effectiveness to string if needed
      if (typeof value === 'number') {
        const effectivenessMap = {
          1: 'Very Low',
          2: 'Low',
          3: 'Medium',
          4: 'High',
          5: 'Very High'
        };
        return effectivenessMap[value] || 'Medium';
      }
      return value;
    }
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

const LearningMethod = mongoose.model('LearningMethod', learningMethodSchema);

export default LearningMethod;
