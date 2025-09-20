import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    trim: true
  },
  instructor: {
    type: String,
    trim: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Active', 'Completed'],
    default: 'Not Started',
    set: function(value) {
      // Convert the status to title case for consistency
      if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'active') return 'Active';
        if (lower === 'in progress' || lower === 'in-progress') return 'In Progress';
        if (lower === 'not started' || lower === 'not-started') return 'Not Started';
        if (lower === 'completed') return 'Completed';
      }
      return value; // Return the original value if no match
    }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  estimatedCompletion: Date,
  notes: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
