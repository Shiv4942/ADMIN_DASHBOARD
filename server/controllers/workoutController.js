import Workout from '../models/Workout.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new workout
// @route   POST /api/workouts
export const createWorkout = asyncHandler(async (req, res) => {
  const { type, duration, calories, notes } = req.body;
  
  const workout = await Workout.create({
    type,
    duration,
    calories,
    notes
  });

  res.status(201).json(workout);
});

// @desc    Get all workouts
// @route   GET /api/workouts
export const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({}).sort({ date: -1 });
  res.json(workouts);
});

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json(workout);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedWorkout);
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  await workout.deleteOne();
  res.json({ message: 'Workout removed' });
});

// @desc    Get workout statistics
// @route   GET /api/workouts/stats
export const getWorkoutStats = asyncHandler(async (req, res) => {
  const stats = await Workout.aggregate([
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
