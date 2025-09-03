const Skill = require('../models/Skill');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// @desc    Get all skills for a user
// @route   GET /api/skills
// @access  Private
exports.getSkills = async (req, res, next) => {
  try {
    const { search, level, category, sortBy } = req.query;
    const query = { userId: req.user._id };
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by level
    if (level) {
      query.level = level;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Sorting
    const sort = {};
    if (sortBy) {
      const parts = sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort.confidence = -1; // Default sort by confidence
    }
    
    const skills = await Skill.find(query).sort(sort);
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Private
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res, next) => {
  try {
    const { name, level, confidence, category, description, tags } = req.body;
    
    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const skill = await Skill.create({
      userId: req.user._id,
      name,
      level: level || 'Beginner',
      confidence: confidence || 0,
      category,
      description,
      tags,
      lastPracticed: new Date()
    });

    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res, next) => {
  try {
    const { name, level, confidence, category, description, tags } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (level) updates.level = level;
    if (confidence !== undefined) updates.confidence = confidence;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (tags !== undefined) updates.tags = tags;

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    res.json({ message: 'Skill removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update skill last practiced date
// @route   PATCH /api/skills/:id/practice
// @access  Private
exports.updateSkillPractice = async (req, res, next) => {
  try {
    const { confidence } = req.body;
    
    const updates = { lastPracticed: new Date() };
    if (confidence !== undefined) {
      updates.confidence = Math.min(Math.max(confidence, 0), 100);
    }

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Get skill statistics
// @route   GET /api/skills/stats
// @access  Private
exports.getSkillStats = async (req, res, next) => {
  try {
    const stats = await Skill.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $project: {
          _id: 0,
          level: '$_id',
          count: 1,
          avgConfidence: { $round: ['$avgConfidence', 2] }
        }
      },
      {
        $sort: { level: 1 }
      }
    ]);

    // Get total skills count
    const totalSkills = await Skill.countDocuments({ userId: req.user._id });
    
    // Get skills by category
    const byCategory = await Skill.aggregate([
      {
        $match: { 
          userId: req.user._id,
          category: { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      byLevel: stats,
      totalSkills,
      byCategory
    });
  } catch (error) {
    next(error);
  }
};
