import { Router } from 'express';

// In-memory fallback, but should ideally read from DB.
let dashboardState = {
  stats: {
    totalWorkouts: 24,
    coursesCompleted: 8,
    monthlyRevenue: 12450
  },
  recentActivities: [
    { type: 'Workout', description: 'Completed strength training session', time: '2 hours ago' },
    { type: 'Course', description: 'Finished React Advanced Concepts', time: '1 day ago' },
    { type: 'Finance', description: 'Updated monthly budget', time: '1 day ago' }
  ]
};

const addActivity = (type, description) => {
  dashboardState.recentActivities = [
    { type, description, time: 'just now' },
    ...dashboardState.recentActivities
  ].slice(0, 20);
};

const router = Router();

router.get('/overview', (req, res) => {
  res.json(dashboardState);
});

router.post('/actions/add-workout', (req, res) => {
  dashboardState.stats.totalWorkouts += 1;
  addActivity('Workout', 'Added a new workout');
  res.json({ ok: true, state: dashboardState });
});

router.post('/actions/log-meal', (req, res) => {
  addActivity('Health', 'Logged a meal');
  res.json({ ok: true, state: dashboardState });
});

router.post('/actions/start-course', (req, res) => {
  addActivity('Course', 'Started a new course');
  res.json({ ok: true, state: dashboardState });
});

export default router;


