import mongoose from 'mongoose';

const MedicationLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['taken', 'missed'], required: true },
  notes: { type: String }
}, { _id: false });

const MedicationSchema = new mongoose.Schema({
  userId: { type: String, index: true, required: true },
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  notes: { type: String },
  logs: { type: [MedicationLogSchema], default: [] },
  reminderAt: { type: String }, // cron-like or HH:mm
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

MedicationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Medication || mongoose.model('Medication', MedicationSchema);


