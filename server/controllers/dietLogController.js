import DietLog from '../models/DietLog.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new diet log
// @route   POST /api/diet-logs
export const createDietLog = asyncHandler(async (req, res) => {
  const { meal, food, calories, protein, carbs, fat, notes } = req.body;
  
  if (!meal || !food || calories === undefined) {
    res.status(400);
    throw new Error('Please provide meal, food, and calories');
  }

  const dietLog = await DietLog.create({
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

// @desc    Get all diet logs
// @route   GET /api/diet-logs
export const getDietLogs = asyncHandler(async (req, res) => {
  try {
    console.log('Fetching diet logs with query:', req.query);
    const { meal, startDate, endDate } = req.query;
    const query = { userId: 'public' }; // Add default userId filter
    
    if (meal) {
      query.meal = meal;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    console.log('MongoDB query:', JSON.stringify(query, null, 2));
    const dietLogs = await DietLog.find(query).sort({ date: -1 }).lean();
    console.log(`Found ${dietLogs.length} diet logs`);
    
    // Ensure all dates are properly formatted
    const formattedLogs = dietLogs.map(log => ({
      ...log,
      date: log.date ? new Date(log.date).toISOString() : null
    }));
    
    res.json(formattedLogs);
  } catch (error) {
    console.error('Error in getDietLogs:', error);
    res.status(500).json({ 
      error: 'Failed to fetch diet logs',
      details: error.message 
    });
  }
});

// @desc    Get diet log by ID
// @route   GET /api/diet-logs/:id
export const getDietLogById = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findById(req.params.id);

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  res.json(dietLog);
});

// @desc    Update a diet log
// @route   PUT /api/diet-logs/:id
export const updateDietLog = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findById(req.params.id);

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  const updatedDietLog = await DietLog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedDietLog);
});

// @desc    Delete a diet log
// @route   DELETE /api/diet-logs/:id
export const deleteDietLog = asyncHandler(async (req, res) => {
  const dietLog = await DietLog.findById(req.params.id);

  if (!dietLog) {
    res.status(404);
    throw new Error('Diet log not found');
  }

  await dietLog.deleteOne();
  res.json({ message: 'Diet log removed' });
});

// @desc    Get nutrition statistics
// @route   GET /api/diet-logs/stats
export const getNutritionStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = {};
  
  // Filter by date range if provided
  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  }
  
  const stats = await DietLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalCalories: { $sum: '$calories' },
        totalProtein: { $sum: '$protein' },
        totalCarbs: { $sum: '$carbs' },
        totalFat: { $sum: '$fat' },
        count: { $sum: 1 }
      }
    },
    {
      $addFields: {
        averageCalories: { $divide: ['$totalCalories', '$count'] },
        averageProtein: { $divide: ['$totalProtein', '$count'] },
        averageCarbs: { $divide: ['$totalCarbs', '$count'] },
        averageFat: { $divide: ['$totalFat', '$count'] }
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
