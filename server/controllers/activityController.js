import Activity from '../models/Activity.js';

export const getActivities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Activity.countDocuments();
    
    // Get paginated activities, sorted by most recent first
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      activities,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalActivities: total
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
};

export const createActivity = async (activityData) => {
  try {
    const activity = new Activity({
      ...activityData,
      timestamp: new Date()
    });
    
    const savedActivity = await activity.save();
    return savedActivity;
  } catch (error) {
    console.error('Error creating activity:', error);
    throw error;
  }
};
