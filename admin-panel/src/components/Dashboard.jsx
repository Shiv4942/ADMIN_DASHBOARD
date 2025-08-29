import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const API_BASE = 'http://localhost:5000/api/dashboard';

  const [stats, setStats] = useState({
    totalWorkouts: 0,
    coursesCompleted: 0,
    monthlyRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchOverview = async () => {
    try {
      const res = await fetch(`${API_BASE}/overview`);
      const data = await res.json();
      setStats(data.stats || {});
      setRecentActivities(data.recentActivities || []);
    } catch (err) {
      console.error('Failed to load dashboard overview', err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const callAction = async (path) => {
    try {
      const res = await fetch(`${API_BASE}/actions/${path}`, { method: 'POST' });
      const data = await res.json();
      if (data?.state) {
        setStats(data.state.stats);
        setRecentActivities(data.state.recentActivities);
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  const handleAddWorkout = () => callAction('add-workout');
  const handleLogMeal = () => callAction('log-meal');
  const handleStartCourse = () => callAction('start-course');



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            </div>
            <div className="text-3xl">💪</div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Courses Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.coursesCompleted}</p>
            </div>
            <div className="text-3xl">📚</div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue?.toLocaleString?.() || stats.monthlyRevenue}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
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
          <button className="btn-primary" onClick={handleAddWorkout}>Add Workout</button>
          <button className="btn-secondary" onClick={handleLogMeal}>Log Meal</button>
          <button className="btn-secondary" onClick={handleStartCourse}>Start Course</button>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
