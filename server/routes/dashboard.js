import { Router } from 'express';
import { getDashboardOverview, refreshDashboardData } from '../controllers/dashboardController.js';
import FinanceSnapshot from '../models/FinanceSnapshot.js';
import Course from '../models/Course.js';
import Workout from '../models/Workout.js';

const router = Router();

// Get dashboard overview data (removed duplicate)
router.get('/overview', getDashboardOverview);

// Add refresh endpoint
router.get('/refresh', refreshDashboardData);

// Debug route to check finance data
router.get('/debug/finance', async (req, res) => {
    try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth(); // 0-indexed
        
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
        
        console.log('Debug date range:', {
            startOfMonth: startOfMonth.toISOString(),
            endOfMonth: endOfMonth.toISOString()
        });
        
        // Check all finance data
        const allFinanceData = await FinanceSnapshot.find({}).lean();
        
        // Check current month income
        const currentMonthIncome = await FinanceSnapshot.find({
            type: 'income',
            $or: [
                {
                    createdAt: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                },
                {
                    date: {
                        $gte: startOfMonth.toISOString().split('T')[0],
                        $lte: endOfMonth.toISOString().split('T')[0]
                    }
                }
            ]
        }).lean();
        
        res.json({
            dateRange: { 
                startOfMonth: startOfMonth.toISOString(), 
                endOfMonth: endOfMonth.toISOString() 
            },
            totalFinanceRecords: allFinanceData.length,
            currentMonthIncomeRecords: currentMonthIncome.length,
            allFinanceData: allFinanceData.slice(0, 5), // First 5 records
            currentMonthIncome
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug route to check course data
router.get('/debug/courses', async (req, res) => {
    try {
        const allCourses = await Course.find({}).lean();
        const completedCourses = await Course.find({
            $or: [
                { status: 'completed' },
                { isCompleted: true }
            ]
        }).lean();
        
        res.json({
            totalCourses: allCourses.length,
            completedCourses: completedCourses.length,
            sampleCourses: allCourses.slice(0, 3),
            sampleCompletedCourses: completedCourses.slice(0, 3)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Debug route to check workout data
router.get('/debug/workouts', async (req, res) => {
    try {
        const allWorkouts = await Workout.find({}).lean();
        
        res.json({
            totalWorkouts: allWorkouts.length,
            sampleWorkouts: allWorkouts.slice(0, 3)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Action routes for quick actions
router.post('/actions/add-workout', async (req, res) => {
    try {
        // Create a new workout (you'll need to adapt this to your Workout model)
        const newWorkout = new Workout({
            name: 'Quick Workout',
            date: new Date(),
            // Add other required fields based on your schema
        });
        
        await newWorkout.save();
        
        res.json({ 
            success: true, 
            message: 'Workout added successfully',
            workoutId: newWorkout._id 
        });
    } catch (error) {
        console.error('Error adding workout:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

router.post('/actions/log-meal', (req, res) => {
    try {
        // Implement meal logging logic here
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Meal logged successfully' 
        });
    } catch (error) {
        console.error('Error logging meal:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

router.post('/actions/start-course', async (req, res) => {
    try {
        // Implement course starting logic here
        // For now, just return success
        res.json({ 
            success: true, 
            message: 'Course started successfully' 
        });
    } catch (error) {
        console.error('Error starting course:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

export default router;