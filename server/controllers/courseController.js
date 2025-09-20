import Course from '../models/Course.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort('-createdAt');
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

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
// @access  Public
export const createCourse = async (req, res, next) => {
  try {
    const { title, platform, instructor, progress, status, startDate, estimatedCompletion, notes, url } = req.body;
    
    if (!title) {
      throw new BadRequestError('Title is required');
    }

    const course = await Course.create({
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
// @access  Public
export const updateCourse = async (req, res, next) => {
  try {
    const { title, platform, instructor, progress, status, startDate, estimatedCompletion, notes, url } = req.body;

    const course = await Course.findByIdAndUpdate(
      req.params.id,
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
// @access  Public
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

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
// @access  Public
export const getCourseStats = async (req, res, next) => {
  try {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalProgress: { $avg: '$progress' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          stats: { $push: '$$ROOT' },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'In Progress'] }, '$count', 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Completed'] }, '$count', 0]
            }
          },
          notStarted: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'Not Started'] }, '$count', 0]
            }
          },
          averageProgress: { $avg: '$totalProgress' }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      inProgress: 0,
      completed: 0,
      notStarted: 0,
      averageProgress: 0
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};
