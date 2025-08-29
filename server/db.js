import mongoose from 'mongoose';

export const connectToDatabase = async (mongoUri) => {
  if (!mongoUri) throw new Error('MONGODB_URI is not set');
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });
};


