import Workout from '../models/Workout.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = asyncHandler(async (req, res) => {
  const { type, duration, calories, notes } = req.body;
  
  const workout = await Workout.create({
    userId: req.user._id,
    type,
    duration,
    calories,
    notes
  });

  res.status(201).json(workout);
});

// @desc    Get all workouts for a user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ userId: req.user._id })
    .sort({ date: -1 });
  
  res.json(workouts);
});

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  res.json(workout);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  const { type, duration, calories, notes } = req.body;

  workout.type = type || workout.type;
  workout.duration = duration || workout.duration;
  workout.calories = calories || workout.calories;
  workout.notes = notes !== undefined ? notes : workout.notes;

  const updatedWorkout = await workout.save();
  res.json(updatedWorkout);
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!workout) {
    res.status(404);
    throw new Error('Workout not found');
  }

  await workout.remove();
  res.json({ message: 'Workout removed' });
});

// @desc    Get workout statistics
// @route   GET /api/workouts/stats
// @access  Private
export const getWorkoutStats = asyncHandler(async (req, res) => {
  const stats = await Workout.aggregate([
    {
      $match: { userId: req.user._id }
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalCalories: { $sum: '$calories' },
        avgCalories: { $avg: '$calories' },
        mostCommonType: {
          $first: {
            $arrayElemAt: [
              { $objectToArray: { $max: { $group: { _id: '$type', count: { $sum: 1 } } } } },
              0
            ]
          }
        }
      }
    }
  ]);

  res.json(stats[0] || { totalWorkouts: 0, totalCalories: 0, avgCalories: 0 });
});
