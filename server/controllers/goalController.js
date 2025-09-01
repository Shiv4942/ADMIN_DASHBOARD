import Goal from '../models/Goal.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new goal
// @route   POST /api/goals
export const createGoal = asyncHandler(async (req, res) => {
  const { title, target, current, deadline, category } = req.body;
  
  if (!title || !target || !deadline) {
    res.status(400);
    throw new Error('Please provide title, target, and deadline');
  }

  const goal = await Goal.create({
    title,
    target,
    current: current || '0',
    deadline,
    category: category || 'fitness'
  });

  res.status(201).json(goal);
});

// @desc    Get all goals
// @route   GET /api/goals
export const getGoals = asyncHandler(async (req, res) => {
  const { category, completed } = req.query;
  const query = {};
  
  if (category) {
    query.category = category;
  }
  
  if (completed !== undefined) {
    query.completed = completed === 'true';
  }

  const goals = await Goal.find(query).sort({ deadline: 1 });
  res.json(goals);
});

// @desc    Get goal by ID
// @route   GET /api/goals/:id
export const getGoalById = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  res.json(goal);
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  const { title, target, current, deadline, completed, category } = req.body;

  goal.title = title || goal.title;
  goal.target = target || goal.target;
  goal.current = current !== undefined ? current : goal.current;
  goal.deadline = deadline || goal.deadline;
  goal.completed = completed !== undefined ? completed : goal.completed;
  goal.category = category || goal.category;

  const updatedGoal = await goal.save();
  res.json(updatedGoal);
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }

  await goal.remove();
  res.json({ message: 'Goal removed' });
});

// @desc    Get goals statistics
// @route   GET /api/goals/stats
export const getGoalStats = asyncHandler(async (req, res) => {
  const stats = await Goal.aggregate([
    {
      $match: {}
    },
    {
      $group: {
        _id: null,
        totalGoals: { $sum: 1 },
        completedGoals: {
          $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
        },
        inProgressGoals: {
          $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
        },
        byCategory: {
          $push: {
            category: '$category',
            completed: { $cond: ['$completed', 1, 0] },
            total: 1
          }
        }
      }
    },
    {
      $addFields: {
        completionRate: {
          $cond: [
            { $eq: ['$totalGoals', 0] },
            0,
            { $divide: ['$completedGoals', '$totalGoals'] }
          ]
        }
      }
    }
  ]);

  // Process category data
  const categoryStats = {};
  if (stats[0]?.byCategory) {
    stats[0].byCategory.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { completed: 0, total: 0 };
      }
      categoryStats[item.category].completed += item.completed;
      categoryStats[item.category].total += item.total;
    });
  }

  const result = {
    totalGoals: stats[0]?.totalGoals || 0,
    completedGoals: stats[0]?.completedGoals || 0,
    inProgressGoals: stats[0]?.inProgressGoals || 0,
    completionRate: stats[0]?.completionRate || 0,
    byCategory: categoryStats
  };

  res.json(result);
});
