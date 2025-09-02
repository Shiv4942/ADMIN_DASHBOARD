import mongoose from 'mongoose';

const dietLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: 'public',
    required: true
  },
  meal: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'],
    default: 'Other'
  },
  food: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
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

// Index for faster querying by user and date
dietLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model('DietLog', dietLogSchema);
