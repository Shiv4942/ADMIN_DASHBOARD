import LearningMethod from '../models/LearningMethod.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

// @desc    Get all learning methods
// @route   GET /api/learning-methods
// @access  Public
export const getLearningMethods = async (req, res, next) => {
  try {
    const { search, effectiveness, sortBy } = req.query;
    const query = {};
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by effectiveness
    if (effectiveness) {
      query.effectiveness = effectiveness;
    }
    
    // Sorting
    const sort = {};
    if (sortBy) {
      const parts = sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.lastUsed = -1; // Default sort by last used
    }
    
    const methods = await LearningMethod.find(query).sort(sort);
    res.json(methods);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single learning method
// @route   GET /api/learning-methods/:id
// @access  Public
export const getLearningMethod = async (req, res, next) => {
  try {
    const method = await LearningMethod.findById(req.params.id);

    if (!method) {
      throw new NotFoundError('Learning method not found');
    }

    res.json(method);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a learning method
// @route   POST /api/learning-methods
// @access  Public
export const createLearningMethod = async (req, res, next) => {
  try {
    const { name, timeSpent, effectiveness, description, isActive } = req.body;
    
    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const method = await LearningMethod.create({
      name,
      timeSpent: timeSpent || { value: 0, unit: 'hours' },
      effectiveness: effectiveness || 'Medium',
      description,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(method);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a learning method
// @route   PUT /api/learning-methods/:id
// @access  Public
export const updateLearningMethod = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'timeSpent', 'effectiveness', 'description', 'isActive', 'lastUsed'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return next(new BadRequestError('Invalid updates!'));
  }

  try {
    const method = await LearningMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!method) {
      throw new NotFoundError('Learning method not found');
    }

    res.json(method);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a learning method
// @route   DELETE /api/learning-methods/:id
// @access  Public
export const deleteLearningMethod = async (req, res, next) => {
  try {
    const method = await LearningMethod.findByIdAndDelete(req.params.id);

    if (!method) {
      throw new NotFoundError('Learning method not found');
    }

    res.json({ message: 'Learning method removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get learning method statistics
// @route   GET /api/learning-methods/stats
// @access  Public
export const getLearningMethodStats = async (req, res, next) => {
  try {
    const stats = await LearningMethod.aggregate([
      {
        $group: {
          _id: '$effectiveness',
          count: { $sum: 1 },
          totalTime: { $sum: '$timeSpent.value' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          stats: { $push: '$$ROOT' },
          veryHighEffectiveness: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Very High'] }, '$count', 0]
            }
          },
          highEffectiveness: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'High'] }, '$count', 0]
            }
          },
          mediumEffectiveness: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Medium'] }, '$count', 0]
            }
          },
          lowEffectiveness: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Low'] }, '$count', 0]
            }
          },
          veryLowEffectiveness: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Very Low'] }, '$count', 0]
            }
          },
          totalTimeSpent: { $sum: '$totalTime' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      veryHighEffectiveness: 0,
      highEffectiveness: 0,
      mediumEffectiveness: 0,
      lowEffectiveness: 0,
      veryLowEffectiveness: 0,
      totalTimeSpent: 0
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
