import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['workout', 'course', 'finance', 'user', 'other'],
    default: 'other'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Remove sensitive or unnecessary fields
      delete ret.__v;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Index for better query performance
activitySchema.index({ type: 1, timestamp: -1 });
activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
