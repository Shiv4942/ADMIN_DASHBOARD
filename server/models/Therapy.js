import mongoose from 'mongoose';

const TherapySchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  therapist: { type: String, required: true },
  sessionDate: { type: Date, required: true },
  type: { type: String, enum: ['individual', 'group', 'online'], required: true },
  notes: { type: String },
  progress: { type: Number, min: 0, max: 100 },
  mood: { type: Number, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

TherapySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Therapy || mongoose.model('Therapy', TherapySchema);


