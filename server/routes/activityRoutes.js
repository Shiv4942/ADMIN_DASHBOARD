import express from 'express';
import { getActivities } from '../controllers/activityController.js';


const router = express.Router();

// Get all activities with pagination
router.get('/', getActivities);

export default router;
