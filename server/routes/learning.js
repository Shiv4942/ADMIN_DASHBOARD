const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStats
} = require('../controllers/courseController');

const {
  getLearningMethods,
  getLearningMethod,
  createLearningMethod,
  updateLearningMethod,
  deleteLearningMethod,
  getLearningMethodStats
} = require('../controllers/learningMethodController');

const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  updateSkillPractice,
  getSkillStats
} = require('../controllers/skillController');

// Course routes
router.route('/courses')
  .get(protect, getCourses)
  .post(protect, createCourse);

router.route('/courses/stats')
  .get(protect, getCourseStats);

router.route('/courses/:id')
  .get(protect, getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);

// Learning Method routes
router.route('/learning-methods')
  .get(protect, getLearningMethods)
  .post(protect, createLearningMethod);

router.route('/learning-methods/stats')
  .get(protect, getLearningMethodStats);

router.route('/learning-methods/:id')
  .get(protect, getLearningMethod)
  .put(protect, updateLearningMethod)
  .delete(protect, deleteLearningMethod);

// Skill routes
router.route('/skills')
  .get(protect, getSkills)
  .post(protect, createSkill);

router.route('/skills/stats')
  .get(protect, getSkillStats);

router.route('/skills/:id')
  .get(protect, getSkill)
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

router.route('/skills/:id/practice')
  .patch(protect, updateSkillPractice);

module.exports = router;
