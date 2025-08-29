import React, { useState } from 'react';

const LearningTools = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [myCourses, setMyCourses] = useState([]);
  const [methods, setMethods] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', platform: '', instructor: '', progress: 0, status: 'Not Started' });
  const [showMethodForm, setShowMethodForm] = useState(false);
  const [newMethod, setNewMethod] = useState({ name: '', timeSpent: '0h', effectiveness: 'Medium', lastUsed: new Date().toISOString().slice(0,10) });
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner', confidence: 0, lastPracticed: new Date().toISOString().slice(0,10) });

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
  ].concat(myCourses);

  const learningMethods = [
    { id: 1, name: 'Video Tutorials', timeSpent: '12h', effectiveness: 'High', lastUsed: '2024-01-15' },
    { id: 2, name: 'Practice Projects', timeSpent: '8h', effectiveness: 'Very High', lastUsed: '2024-01-14' },
    { id: 3, name: 'Reading Documentation', timeSpent: '6h', effectiveness: 'Medium', lastUsed: '2024-01-13' },
    { id: 4, name: 'Peer Learning', timeSpent: '4h', effectiveness: 'High', lastUsed: '2024-01-12' },
  ].concat(methods);

  const skills = [
    { name: 'React', level: 'Advanced', confidence: 85, lastPracticed: '2024-01-15' },
    { name: 'Node.js', level: 'Intermediate', confidence: 70, lastPracticed: '2024-01-14' },
    { name: 'Python', level: 'Beginner', confidence: 40, lastPracticed: '2024-01-10' },
    { name: 'SQL', level: 'Intermediate', confidence: 65, lastPracticed: '2024-01-08' },
  ].concat(mySkills);

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
        <button className="btn-primary" onClick={() => setShowCourseForm(true)}>Enroll in Course</button>
      </div>
      {showCourseForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="input-field" placeholder="Title" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} />
            <input className="input-field" placeholder="Platform" value={newCourse.platform} onChange={(e) => setNewCourse({ ...newCourse, platform: e.target.value })} />
            <input className="input-field" placeholder="Instructor" value={newCourse.instructor} onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })} />
            <select className="input-field" value={newCourse.status} onChange={(e) => setNewCourse({ ...newCourse, status: e.target.value })}>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newCourse.title) { alert('Enter a title'); return; }
                setMyCourses(prev => [{ id: Date.now(), estimatedCompletion: '', ...newCourse }, ...prev]);
                setNewCourse({ title: '', platform: '', instructor: '', progress: 0, status: 'Not Started' });
                setShowCourseForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowCourseForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
        <button className="btn-primary" onClick={() => setShowMethodForm(true)}>Add Method</button>
      </div>
      {showMethodForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="input-field" placeholder="Method name" value={newMethod.name} onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })} />
            <input className="input-field" placeholder="Time spent (e.g., 2h)" value={newMethod.timeSpent} onChange={(e) => setNewMethod({ ...newMethod, timeSpent: e.target.value })} />
            <select className="input-field" value={newMethod.effectiveness} onChange={(e) => setNewMethod({ ...newMethod, effectiveness: e.target.value })}>
              <option>Very High</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newMethod.name) { alert('Enter method name'); return; }
                setMethods(prev => [{ id: Date.now(), lastUsed: new Date().toISOString().slice(0,10), ...newMethod }, ...prev]);
                setNewMethod({ name: '', timeSpent: '0h', effectiveness: 'Medium', lastUsed: new Date().toISOString().slice(0,10) });
                setShowMethodForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowMethodForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
        <button className="btn-primary" onClick={() => setShowSkillForm(true)}>Add Skill</button>
      </div>
      {showSkillForm && (
        <div className="card p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input className="input-field" placeholder="Skill name" value={newSkill.name} onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} />
            <select className="input-field" value={newSkill.level} onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input className="input-field" type="number" placeholder="Confidence %" value={newSkill.confidence} onChange={(e) => setNewSkill({ ...newSkill, confidence: parseInt(e.target.value || '0', 10) })} />
            <input className="input-field" type="date" value={newSkill.lastPracticed} onChange={(e) => setNewSkill({ ...newSkill, lastPracticed: e.target.value })} />
            <div className="flex space-x-2">
              <button className="btn-primary" onClick={() => {
                if (!newSkill.name) { alert('Enter skill name'); return; }
                setMySkills(prev => [{ ...newSkill }, ...prev]);
                setNewSkill({ name: '', level: 'Beginner', confidence: 0, lastPracticed: new Date().toISOString().slice(0,10) });
                setShowSkillForm(false);
              }}>Save</button>
              <button className="btn-secondary" onClick={() => setShowSkillForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
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
