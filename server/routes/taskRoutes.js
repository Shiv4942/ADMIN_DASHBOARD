import express from 'express';
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController.js';

const router = express.Router();

router.route('/project/:projectId').get(getTasksByProject);

router
  .route('/')
  .post(createTask);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router
  .route('/:id/status')
  .patch(updateTaskStatus);

export default router;
