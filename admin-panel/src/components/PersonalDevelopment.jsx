import React from 'react';

const PersonalDevelopment = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Personal Development</h1>
        <p className="text-gray-600 mt-2">Track your personal growth and development goals.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="space-y-3">
            <p className="text-gray-600">Use the sidebar to navigate to specific sections:</p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Health & Fitness:</strong> Track workouts, goals, and nutrition</li>
              <li>• <strong>Learning Tools:</strong> Monitor courses and skill development</li>
            </ul>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Development Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Fitness Goals:</span>
              <span className="font-medium">3 Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Courses:</span>
              <span className="font-medium">4 In Progress</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Skills:</span>
              <span className="font-medium">8 Tracked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDevelopment;
