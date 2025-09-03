const LearningMethod = require('../models/LearningMethod');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// @desc    Get all learning methods for a user
// @route   GET /api/learning-methods
// @access  Private
exports.getLearningMethods = async (req, res, next) => {
  try {
    const { search, effectiveness, sortBy } = req.query;
    const query = { userId: req.user._id };
    
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
// @access  Private
exports.getLearningMethod = async (req, res, next) => {
  try {
    const method = await LearningMethod.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

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
// @access  Private
exports.createLearningMethod = async (req, res, next) => {
  try {
    const { name, timeSpent, effectiveness, description } = req.body;
    
    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const method = await LearningMethod.create({
      userId: req.user._id,
      name,
      timeSpent: timeSpent || { value: 0, unit: 'hours' },
      effectiveness: effectiveness || 'Medium',
      description,
      lastUsed: new Date()
    });

    res.status(201).json(method);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a learning method
// @route   PUT /api/learning-methods/:id
// @access  Private
exports.updateLearningMethod = async (req, res, next) => {
  try {
    const { name, timeSpent, effectiveness, description, lastUsed } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (timeSpent) updates.timeSpent = timeSpent;
    if (effectiveness) updates.effectiveness = effectiveness;
    if (description !== undefined) updates.description = description;
    if (lastUsed) updates.lastUsed = lastUsed;

    const method = await LearningMethod.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
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
// @access  Private
exports.deleteLearningMethod = async (req, res, next) => {
  try {
    const method = await LearningMethod.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

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
// @access  Private
exports.getLearningMethodStats = async (req, res, next) => {
  try {
    const stats = await LearningMethod.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: '$effectiveness',
          count: { $sum: 1 },
          totalTime: { 
            $sum: {
              $switch: {
                branches: [
                  { 
                    case: { $eq: ['$timeSpent.unit', 'minutes'] },
                    then: { $divide: ['$timeSpent.value', 60] }
                  },
                  { 
                    case: { $eq: ['$timeSpent.unit', 'hours'] },
                    then: '$timeSpent.value'
                  },
                  { 
                    case: { $eq: ['$timeSpent.unit', 'days'] },
                    then: { $multiply: ['$timeSpent.value', 24] }
                  }
                ],
                default: 0
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          effectiveness: '$_id',
          count: 1,
          totalHours: { $round: ['$totalTime', 2] }
        }
      },
      {
        $sort: { effectiveness: 1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    next(error);
  }
};
