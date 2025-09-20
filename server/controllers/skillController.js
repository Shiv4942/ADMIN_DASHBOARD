import Skill from '../models/Skill.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res, next) => {
  try {
    const { search, level, category, sortBy } = req.query;
    const query = {};
    
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
      sort.name = 1; // Default sort by name
    }
    
    const skills = await Skill.find(query).sort(sort);
    res.json(skills);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
export const getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

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
// @access  Public
export const createSkill = async (req, res, next) => {
  try {
    const { name, level, confidence, category, description, isActive, tags } = req.body;
    
    if (!name) {
      throw new BadRequestError('Name is required');
    }

    const skill = await Skill.create({
      name,
      level: level || 'Beginner',
      confidence: confidence || 0,
      category,
      description,
      isActive: isActive !== undefined ? isActive : true,
      tags: tags || []
    });

    res.status(201).json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Public
export const updateSkill = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'level', 'confidence', 'category', 'description', 'isActive', 'tags'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return next(new BadRequestError('Invalid updates!'));
  }

  try {
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
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
// @access  Public
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

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
// @access  Public
export const updateSkillPractice = async (req, res, next) => {
  try {
    const { confidence } = req.body;
    
    const updates = { lastPracticed: new Date() };
    if (confidence !== undefined) {
      updates.confidence = Math.min(Math.max(confidence, 0), 100);
    }

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
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
// @access  Public
export const getSkillStats = async (req, res, next) => {
  try {
    const stats = await Skill.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          stats: { $push: '$$ROOT' },
          beginner: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Beginner'] }, '$count', 0]
            }
          },
          intermediate: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Intermediate'] }, '$count', 0]
            }
          },
          advanced: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Advanced'] }, '$count', 0]
            }
          },
          expert: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Expert'] }, '$count', 0]
            }
          },
          averageConfidence: { $avg: '$avgConfidence' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      beginner: 0,
      intermediate: 0,
      advanced: 0,
      expert: 0,
      averageConfidence: 0
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
