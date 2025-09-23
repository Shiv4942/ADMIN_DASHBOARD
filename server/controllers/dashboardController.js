import Course from '../models/Course.js';
import Workout from '../models/Workout.js';
import FinanceSnapshot from '../models/FinanceSnapshot.js';

// Get dashboard overview data
export const getDashboardOverview = async (req, res) => {
    try {
        console.log('Fetching dashboard overview data...');
        
        // Get total workouts
        const totalWorkouts = await Workout.countDocuments();
        console.log('Total workouts:', totalWorkouts);
        
        // Get completed courses - fix the field name based on your schema
        // If your Course model uses 'completed' status, keep it as is
        // If it uses boolean 'isCompleted', change the query accordingly
        const coursesCompleted = await Course.countDocuments({ 
            $or: [
                { status: 'completed' },
                { isCompleted: true } // Add this if your schema uses boolean
            ]
        });
        console.log('Courses completed:', coursesCompleted);
        
        // Get current date properly
       // At the top of the getDashboardOverview function:
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth(); // 0-indexed

// Get the first day of current month (at 00:00:00)
const startOfMonth = new Date(currentYear, currentMonth, 1);
// Get the last day of current month (at 23:59:59.999)
const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);

console.log('Date range:', {
    startOfMonth,
    endOfMonth,
    formattedStart: startOfMonth.toISOString(),
    formattedEnd: endOfMonth.toISOString()
});
        
        // Debug: Check what finance records exist
        const sampleFinanceRecords = await FinanceSnapshot.find({}).limit(3).lean();
        console.log('Sample finance records:', sampleFinanceRecords);
        
        // Get monthly revenue using proper date comparison
        // In dashboardController.js, update the monthly revenue calculation:

// Replace the monthlyIncome aggregation with this:
const financeData = await FinanceSnapshot.findOne({}).lean();
let monthlyRevenue = 0;

if (financeData && financeData.summary) {
    // Use the monthlyIncome from the summary
    monthlyRevenue = financeData.summary.monthlyIncome || 0;
    console.log('Using monthlyIncome from summary:', monthlyRevenue);
} else {
    // Fallback to the aggregation if the structure is different
    const monthlyIncomeResult = await FinanceSnapshot.aggregate([
        // ... (keep the existing aggregation pipeline)
    ]);
    monthlyRevenue = monthlyIncomeResult.length > 0 ? monthlyIncomeResult[0].total : 0;
}

console.log('Final monthly revenue:', monthlyRevenue);
        
        // Calculate previous month for comparison
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const startOfPrevMonth = new Date(prevYear, prevMonth, 1);
        const endOfPrevMonth = new Date(prevYear, prevMonth + 1, 0, 23, 59, 59, 999);
        
        // Get previous month's data for comparison
        const prevMonthWorkouts = await Workout.countDocuments({
            $or: [
                {
                    createdAt: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                },
                {
                    date: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                }
            ]
        });
        
        const prevMonthCourses = await Course.countDocuments({
            $or: [
                { status: 'completed' },
                { isCompleted: true }
            ],
            $or: [
                {
                    updatedAt: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                },
                {
                    completedAt: {
                        $gte: startOfPrevMonth,
                        $lte: endOfPrevMonth
                    }
                }
            ]
        });
        
        const prevMonthRevenueResult = await FinanceSnapshot.aggregate([
            {
                $match: {
                    type: 'income',
                    $or: [
                        {
                            createdAt: {
                                $gte: startOfPrevMonth,
                                $lte: endOfPrevMonth
                            }
                        },
                        {
                            date: {
                                $gte: startOfPrevMonth.toISOString().split('T')[0],
                                $lte: endOfPrevMonth.toISOString().split('T')[0]
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        
        const prevMonthRevenue = prevMonthRevenueResult.length > 0 ? prevMonthRevenueResult[0].total : 0;
        
        // Calculate percentage changes
        const calculatePercentageChange = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };
        
        const monthlyChange = {
            workouts: calculatePercentageChange(totalWorkouts, prevMonthWorkouts),
            courses: calculatePercentageChange(coursesCompleted, prevMonthCourses),
            revenue: calculatePercentageChange(monthlyRevenue, prevMonthRevenue),
            users: 0 // Implement user tracking as needed
        };
        
        // Get recent activities with proper error handling
        let recentActivities = [];
        
        try {
            const recentWorkouts = await Workout.find()
                .sort({ createdAt: -1, date: -1 })
                .limit(5)
                .select('name date createdAt')
                .lean();
            
            const recentCourses = await Course.find({
                $or: [
                    { status: 'completed' },
                    { isCompleted: true }
                ]
            })
                .sort({ updatedAt: -1, completedAt: -1 })
                .limit(5)
                .select('title name status updatedAt completedAt')
                .lean();
            
            // Format activities
            const workoutActivities = recentWorkouts.map(workout => ({
                title: 'Workout Completed',
                description: `Completed workout: ${workout.name}`,
                timestamp: workout.createdAt || workout.date,
                type: 'workout'
            }));
            
            const courseActivities = recentCourses.map(course => ({
                title: 'Course Completed',
                description: `Completed course: ${course.title || course.name}`,
                timestamp: course.completedAt || course.updatedAt,
                type: 'course'
            }));
            
            // Combine and sort activities
            recentActivities = [...workoutActivities, ...courseActivities]
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10);
                
        } catch (activityError) {
            console.error('Error fetching recent activities:', activityError);
            // Continue with empty activities if there's an error
        }
        
        // Get active users count (you'll need to implement this based on your user tracking)
        // For now, using a placeholder
        const activeUsers = 0; // Implement based on your requirements
        
        const response = {
            stats: {
                totalWorkouts,
                coursesCompleted,
                monthlyRevenue: Math.round(monthlyRevenue), // Round to avoid decimal issues
                activeUsers
            },
            monthlyChange,
            recentActivities
        };
        
        console.log('Dashboard response:', response);
        res.json(response);
        
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ 
            message: 'Error fetching dashboard data', 
            error: error.message 
        });
    }
};

// Additional helper function to refresh dashboard data
export const refreshDashboardData = async (req, res) => {
    try {
        // This endpoint can be called to trigger a data refresh
        // You can add any cache clearing logic here if needed
        
        // Simply call the main overview function
        return getDashboardOverview(req, res);
    } catch (error) {
        console.error('Error refreshing dashboard data:', error);
        res.status(500).json({ 
            message: 'Error refreshing dashboard data', 
            error: error.message 
        });
    }
};