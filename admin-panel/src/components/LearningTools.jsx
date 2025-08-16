import React, { useState } from 'react';

const LearningTools = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    { 
      id: 1, 
      title: 'React Advanced Concepts', 
      platform: 'Udemy', 
      instructor: 'John Doe',
      progress: 85, 
      status: 'In Progress',
      startDate: '2024-01-01',
      estimatedCompletion: '2024-02-15'
    },
    { 
      id: 2, 
      title: 'Node.js Backend Development', 
      platform: 'Coursera', 
      instructor: 'Jane Smith',
      progress: 100, 
      status: 'Completed',
      startDate: '2023-11-01',
      estimatedCompletion: '2024-01-15'
    },
    { 
      id: 3, 
      title: 'Machine Learning Basics', 
      platform: 'edX', 
      instructor: 'Dr. Brown',
      progress: 30, 
      status: 'In Progress',
      startDate: '2024-01-10',
      estimatedCompletion: '2024-04-01'
    },
    { 
      id: 4, 
      title: 'UI/UX Design Principles', 
      platform: 'Skillshare', 
      instructor: 'Sarah Wilson',
      progress: 0, 
      status: 'Not Started',
      startDate: '2024-02-01',
      estimatedCompletion: '2024-03-01'
    },
  ];

  const learningMethods = [
    { id: 1, name: 'Video Tutorials', timeSpent: '12h', effectiveness: 'High', lastUsed: '2024-01-15' },
    { id: 2, name: 'Practice Projects', timeSpent: '8h', effectiveness: 'Very High', lastUsed: '2024-01-14' },
    { id: 3, name: 'Reading Documentation', timeSpent: '6h', effectiveness: 'Medium', lastUsed: '2024-01-13' },
    { id: 4, name: 'Peer Learning', timeSpent: '4h', effectiveness: 'High', lastUsed: '2024-01-12' },
  ];

  const skills = [
    { name: 'React', level: 'Advanced', confidence: 85, lastPracticed: '2024-01-15' },
    { name: 'Node.js', level: 'Intermediate', confidence: 70, lastPracticed: '2024-01-14' },
    { name: 'Python', level: 'Beginner', confidence: 40, lastPracticed: '2024-01-10' },
    { name: 'SQL', level: 'Intermediate', confidence: 65, lastPracticed: '2024-01-08' },
  ];

  const tabs = [
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'methods', label: 'Learning Methods', icon: '🔧' },
    { id: 'skills', label: 'Skills', icon: '🎯' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectivenessColor = (effectiveness) => {
    switch (effectiveness) {
      case 'Very High': return 'text-green-600';
      case 'High': return 'text-blue-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderCourses = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Courses</h3>
        <button className="btn-primary">Enroll in Course</button>
      </div>
      <div className="grid gap-4">
        {courses.map((course) => (
          <div key={course.id} className="card p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{course.title}</h4>
                <p className="text-sm text-gray-600">{course.platform} • {course.instructor}</p>
                <p className="text-sm text-gray-600">Started: {course.startDate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {course.status}
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
            {course.status === 'In Progress' && (
              <p className="text-sm text-gray-600">Estimated completion: {course.estimatedCompletion}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderMethods = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Learning Methods</h3>
        <button className="btn-primary">Add Method</button>
      </div>
      <div className="grid gap-4">
        {learningMethods.map((method) => (
          <div key={method.id} className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-900">{method.name}</h4>
              <span className={`font-medium ${getEffectivenessColor(method.effectiveness)}`}>
                {method.effectiveness}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Time Spent:</span>
                <span className="ml-2 font-medium">{method.timeSpent}</span>
              </div>
              <div>
                <span className="text-gray-600">Last Used:</span>
                <span className="ml-2 font-medium">{method.lastUsed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills Assessment</h3>
        <button className="btn-primary">Add Skill</button>
      </div>
      <div className="grid gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="card p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                <p className="text-sm text-gray-600">Level: {skill.level}</p>
              </div>
              <span className="text-lg font-bold text-primary-600">{skill.confidence}%</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Confidence</span>
                <span>{skill.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.confidence}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Last practiced: {skill.lastPracticed}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Tools</h1>
        <p className="text-gray-600 mt-2">Track your courses, learning methods, and skill development.</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'courses' && renderCourses()}
        {activeTab === 'methods' && renderMethods()}
        {activeTab === 'skills' && renderSkills()}
      </div>
    </div>
  );
};

export default LearningTools;
