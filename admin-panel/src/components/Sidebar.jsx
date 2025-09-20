import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'health-fitness', label: 'Health & Fitness', icon: '💪' },
    { id: 'learning-tools', label: 'Learning Tools', icon: '📚' },
    { id: 'finances', label: 'Finances Overview', icon: '💰' },
    { id: 'medication', label: 'Drug & Medication', icon: '➕' },
    { id: 'project', label: 'Project', icon: '🗂️' },
    
  ];

  return (
    <div
      className={`relative h-screen bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-6 -right-3 bg-white p-1 rounded-full shadow-md border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <FiChevronRight className="h-5 w-5" />
        ) : (
          <FiChevronLeft className="h-5 w-5" />
        )}
      </button>

      <div className="p-6">
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          )}
          <button
            onClick={toggleSidebar}
            className={`p-1 rounded-md hover:bg-gray-100 md:hidden ${
              isCollapsed ? 'mx-auto' : ''
            }`}
          >
            <FiMenu className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center' : ''
              } space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                activeSection === item.id
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
