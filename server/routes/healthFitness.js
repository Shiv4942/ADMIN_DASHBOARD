import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  createWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats
} from '../controllers/workoutController.js';

import {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
  getGoalStats
} from '../controllers/goalController.js';

import {
  createDietLog,
  getDietLogs,
  getDietLogById,
  updateDietLog,
  deleteDietLog,
  getNutritionStats
} from '../controllers/dietLogController.js';

const router = Router();

// Apply protect middleware to all routes
router.use(protect);

// Workout routes
router.route('/workouts')
  .post(createWorkout)
  .get(getWorkouts);

router.route('/workouts/stats')
  .get(getWorkoutStats);

router.route('/workouts/:id')
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

// Goal routes
router.route('/goals')
  .post(createGoal)
  .get(getGoals);

router.route('/goals/stats')
  .get(getGoalStats);

router.route('/goals/:id')
  .get(getGoalById)
  .put(updateGoal)
  .delete(deleteGoal);

// Diet Log routes
router.route('/diet-logs')
  .post(createDietLog)
  .get(getDietLogs);

router.route('/diet-logs/stats')
  .get(getNutritionStats);

router.route('/diet-logs/:id')
  .get(getDietLogById)
  .put(updateDietLog)
  .delete(deleteDietLog);

export default router;
