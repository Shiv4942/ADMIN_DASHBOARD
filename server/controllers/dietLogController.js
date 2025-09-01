import DietLog from '../models/DietLog.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new diet log
// @route   POST /api/diet-logs
// @access  Private
export const createDietLog = asyncHandler(async (req, res) => {
  const { meal, food, calories, protein, carbs, fat, notes } = req.body;
  
  if (!meal || !food || calories === undefined) {
    res.status(400);
    throw new Error('Please provide meal, food, and calories');
  }

  const dietLog = await DietLog.create({
    userId: req.user._id,
    meal,
    food,
    calories,
    protein: protein || 0,
    carbs: carbs || 0,
    fat: fat || 0,
    notes
  });

  res.status(201).json(dietLog);
});

// @desc    Get all diet logs for a user
// @route   GET /api/diet-logs
// @access  Private
export const getDietLogs = asyncHandler(async (req, res) => {
  const { startDate, endDate, meal } = req.query;
  const query = { userId: req.user._id };
  
  // Filter by date range if provided
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.date.$lte = end;
    }
  }
  
  // Filter by meal type if provided
  if (meal) {
    query.meal = meal;
  }

  const dietLogs = await DietLog.find(query).sort({ date: -1 });
  res.json(dietLogs);
});

// @desc    Get diet log by ID
// @route   GET /api/diet-logs/:id
// @access  Private
export const getDietLogById = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  res.json(dietLog);
});

// @desc    Update a diet log
// @route   PUT /api/diet-logs/:id
// @access  Private
export const updateDietLog = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  const { meal, food, calories, protein, carbs, fat, notes } = req.body;

  dietLog.meal = meal || dietLog.meal;
  dietLog.food = food || dietLog.food;
  dietLog.calories = calories !== undefined ? calories : dietLog.calories;
  dietLog.protein = protein !== undefined ? protein : dietLog.protein;
  dietLog.carbs = carbs !== undefined ? carbs : dietLog.carbs;
  dietLog.fat = fat !== undefined ? fat : dietLog.fat;
  dietLog.notes = notes !== undefined ? notes : dietLog.notes;

  const updatedDietLog = await dietLog.save();
  res.json(updatedDietLog);
});

// @desc    Delete a diet log
// @route   DELETE /api/diet-logs/:id
// @access  Private
export const deleteDietLog = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  await dietLog.remove();
  res.json({ message: 'Diet log removed' });
});

// @desc    Get nutrition statistics
// @route   GET /api/diet-logs/stats
// @access  Private
export const getNutritionStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = { userId: req.user._id };
  
  // Filter by date range if provided
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }

  const stats = await DietLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: '$calories' },
        avgCalories: { $avg: '$calories' },
        totalProtein: { $sum: '$protein' },
        totalCarbs: { $sum: '$carbs' },
        totalFat: { $sum: '$fat' },
        count: { $sum: 1 },
        byMeal: {
          $push: {
            meal: '$meal',
            calories: '$calories',
            protein: '$protein',
            carbs: '$carbs',
            fat: '$fat'
          }
        }
      }
    },
    {
      $addFields: {
        avgProtein: { $divide: ['$totalProtein', '$count'] },
        avgCarbs: { $divide: ['$totalCarbs', '$count'] },
        avgFat: { $divide: ['$totalFat', '$count'] }
      }
    }
  ]);

  // Process meal data
  const mealStats = {};
  if (stats[0]?.byMeal) {
    stats[0].byMeal.forEach(item => {
      if (!mealStats[item.meal]) {
        mealStats[item.meal] = {
          count: 0,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0
        };
      }
      mealStats[item.meal].count += 1;
      mealStats[item.meal].totalCalories += item.calories;
      mealStats[item.meal].totalProtein += item.protein;
      mealStats[item.meal].totalCarbs += item.carbs;
      mealStats[item.meal].totalFat += item.fat;
    });

    // Calculate averages for each meal
    Object.keys(mealStats).forEach(meal => {
      const m = mealStats[meal];
      m.avgCalories = m.totalCalories / m.count;
      m.avgProtein = m.totalProtein / m.count;
      m.avgCarbs = m.totalCarbs / m.count;
      m.avgFat = m.totalFat / m.count;
    });
  }

  const result = {
    totalCalories: stats[0]?.totalCalories || 0,
    avgCalories: stats[0]?.avgCalories || 0,
    totalProtein: stats[0]?.totalProtein || 0,
    totalCarbs: stats[0]?.totalCarbs || 0,
    totalFat: stats[0]?.totalFat || 0,
    avgProtein: stats[0]?.avgProtein || 0,
    avgCarbs: stats[0]?.avgCarbs || 0,
    avgFat: stats[0]?.avgFat || 0,
    totalEntries: stats[0]?.count || 0,
    byMeal: mealStats
  };

  res.json(result);
});
