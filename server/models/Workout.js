import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'public',
    required: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Workout', workoutSchema);
