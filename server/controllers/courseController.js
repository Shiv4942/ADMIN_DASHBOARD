const Course = require('../models/Course');
const { NotFoundError, BadRequestError } = require('../utils/errors');

// @desc    Get all courses for a user
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ userId: req.user._id }).sort('-createdAt');
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a course
// @route   POST /api/courses
// @access  Private
exports.createCourse = async (req, res, next) => {
  try {
    const { title, platform, instructor, progress, status, startDate, estimatedCompletion, notes, url } = req.body;
    
    if (!title) {
      throw new BadRequestError('Title is required');
    }

    const course = await Course.create({
      userId: req.user._id,
      title,
      platform,
      instructor,
      progress: progress || 0,
      status: status || 'Not Started',
      startDate: startDate || new Date(),
      estimatedCompletion,
      notes,
      url
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private
exports.updateCourse = async (req, res, next) => {
  try {
    const { title, platform, instructor, progress, status, startDate, estimatedCompletion, notes, url } = req.body;

    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        title,
        platform,
        instructor,
        progress,
        status,
        startDate,
        estimatedCompletion,
        notes,
        url
      },
      { new: true, runValidators: true }
    );

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    res.json({ message: 'Course removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course statistics
// @route   GET /api/courses/stats
// @access  Private
exports.getCourseStats = async (req, res, next) => {
  try {
    const stats = await Course.aggregate([
      {
        $match: { userId: req.user._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalProgress: { $avg: '$progress' }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          averageProgress: { $round: ['$totalProgress', 2] }
        }
      },
      {
        $sort: { status: 1 }
      }
    ]);

    res.json(stats);
  } catch (error) {
    next(error);
  }
};
