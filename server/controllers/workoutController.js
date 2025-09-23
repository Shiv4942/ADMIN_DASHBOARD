import Workout from '../models/Workout.js';
import asyncHandler from 'express-async-handler';
import { createActivity } from './activityController.js';

// @desc    Create a new workout
// @route   POST /api/workouts
export const createWorkout = asyncHandler(async (req, res) => {
  console.log('Request body:', req.body); // Debug log
  const { type, duration, calories, notes } = req.body;
  
  // Validate required fields
  if (!type || !duration) {
    res.status(400);
    throw new Error('Please provide type and duration for the workout');
  }
  
  const workout = await Workout.create({
    type: type || 'general', // Provide a default value if type is undefined
    duration,
    calories: calories || 0,
    notes: notes || '',
    userId: 'public' // Default userId since we're not using authentication yet
  });

  // Create an activity for the workout
  const activityData = {
    type: 'workout',
    title: 'Workout Completed',
    description: `Completed ${type || 'a workout'} for ${duration} minutes`,
    userId: 'public',
    metadata: {
      workoutId: workout._id,
      duration: duration,
      calories: calories || 0,
      workoutType: type || 'general'
    }
  };
  
  console.log('Creating activity with data:', activityData); // Debug log
  try {
    await createActivity(activityData);
  } catch (error) {
    console.error('Error creating activity:', error);
  }

  res.status(201).json(workout);
});

// @desc    Get all workouts
// @route   GET /api/workouts
export const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ userId: 'public' }).sort({ date: -1 });
  res.json(workouts);
});

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, userId: 'public' });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json(workout);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({ _id: req.params.id, userId: 'public' });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  const updatedWorkout = await Workout.findOneAndUpdate(
    { _id: req.params.id, userId: 'public' },
    req.body,
    { new: true }
  );

  res.json(updatedWorkout);
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
export const deleteWorkout = asyncHandler(async (req, res) => {
  const result = await Workout.deleteOne({ _id: req.params.id, userId: 'public' });

  if (result.deletedCount === 0) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json({ message: 'Workout removed' });
});

// @desc    Get workout statistics
// @route   GET /api/workouts/stats
export const getWorkoutStats = asyncHandler(async (req, res) => {
  const stats = await Workout.aggregate([
    {
      $match: { userId: 'public' }
    },
    {
      $group: {
        _id: '$type',
        totalDuration: { $sum: '$duration' },
        totalCalories: { $sum: '$calories' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(stats);
});
