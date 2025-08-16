import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Workouts', value: '24', change: '+12%', icon: '💪' },
    { label: 'Courses Completed', value: '8', change: '+25%', icon: '📚' },
    { label: 'Emails Pending', value: '15', change: '-5%', icon: '📧' },
    { label: 'Monthly Revenue', value: '$12,450', change: '+18%', icon: '💰' },
  ];

  const recentActivities = [
    { type: 'Workout', description: 'Completed strength training session', time: '2 hours ago' },
    { type: 'Course', description: 'Finished React Advanced Concepts', time: '1 day ago' },
    { type: 'Email', description: 'Replied to client inquiry', time: '3 hours ago' },
    { type: 'Finance', description: 'Updated monthly budget', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 text-sm font-medium">
                    {activity.type.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.type}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn-primary">Add Workout</button>
          <button className="btn-secondary">Log Meal</button>
          <button className="btn-secondary">Start Course</button>
          <button className="btn-primary">Send Email</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
