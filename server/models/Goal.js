import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'public',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: String,
    required: true
  },
  current: {
    type: String,
    default: '0'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  deadline: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['fitness', 'workout', 'nutrition', 'other'],
    default: 'fitness'
  }
}, {
  timestamps: true
});

goalSchema.pre('save', function(next) {
  if (this.isModified('current') || this.isModified('target')) {
    const current = parseFloat(this.current) || 0;
    const target = parseFloat(this.target) || 1; // Avoid division by zero
    this.progress = Math.min(Math.round((current / target) * 100), 100);
    this.completed = this.progress >= 100;
  }
  next();
});

export default mongoose.model('Goal', goalSchema);
