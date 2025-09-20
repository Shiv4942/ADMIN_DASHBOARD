import express from 'express';

// Import controllers
import {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse, getCourseStats
} from '../controllers/courseController.js';

import {
  getLearningMethods, getLearningMethod, createLearningMethod,
  updateLearningMethod, deleteLearningMethod, getLearningMethodStats
} from '../controllers/learningMethodController.js';

import {
  getSkills, getSkill, createSkill, updateSkill,
  deleteSkill, updateSkillPractice, getSkillStats
} from '../controllers/skillController.js';

const router = express.Router();

// Course routes
// Learning Method routes
// Skill routes

// Course routes
router.route('/courses')
  .get( getCourses)
  .post(createCourse);

router.route('/courses/stats')
  .get(getCourseStats);

router.route('/courses/:id')
  .get( getCourse)
  .put( updateCourse)
  .delete( deleteCourse);

// Learning Method routes
router.route('/learning-methods')
  .get( getLearningMethods)
  .post( createLearningMethod);

router.route('/learning-methods/stats')
  .get( getLearningMethodStats);

router.route('/learning-methods/:id')
  .get( getLearningMethod)
  .put( updateLearningMethod)
  .delete( deleteLearningMethod);

// Skill routes
router.route('/skills')
  .get( getSkills)
  .post( createSkill);

router.route('/skills/stats')
  .get( getSkillStats);

router.route('/skills/:id')
  .get( getSkill)
  .put( updateSkill)
  .delete( deleteSkill);

router.route('/skills/:id/practice')
  .patch( updateSkillPractice);

export default router;
