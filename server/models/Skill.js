import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
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
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Beginner'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastPracticed: {
    type: Date,
    default: Date.now
  },
  category: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search
skillSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text',
  tags: 'text'
});

// Virtual for formatted last practiced date
skillSchema.virtual('lastPracticedFormatted').get(function() {
  return this.lastPracticed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
