import mongoose from 'mongoose';
import dotenv from 'dotenv';
import DietLog from './models/DietLog.js';

dotenv.config();

const sampleDietLogs = [
  {
    userId: 'public',
    meal: 'Breakfast',
    food: 'Oatmeal with fruits',
    calories: 350,
    protein: 12,
    carbs: 60,
    fat: 8,
    notes: 'With honey and banana'
  },
  {
    userId: 'public',
    meal: 'Lunch',
    food: 'Grilled Chicken Salad',
    calories: 450,
    protein: 35,
    carbs: 20,
    fat: 25,
    notes: 'With olive oil dressing'
  },
  {
    userId: 'public',
    meal: 'Dinner',
    food: 'Salmon with Quinoa',
    calories: 550,
    protein: 40,
    carbs: 45,
    fat: 22,
    notes: 'Steamed vegetables on the side'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await DietLog.deleteMany({});
    console.log('Cleared existing diet logs');
    
    // Add sample data
    const createdLogs = await DietLog.insertMany(sampleDietLogs);
    console.log(`Added ${createdLogs.length} diet logs`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
