import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import HealthFitness from './components/HealthFitness';
import LearningTools from "./components/learning/LearningTools";
import FinancesOverview from './components/FinancesOverview';
import DrugAndMed from './components/DrugAndMed';
import Project from './components/Project';
import Activities from './components/Activities';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the active section from the current path
  const getActiveSection = () => {
    const path = location.pathname.split('/')[1];
    return path || 'dashboard';
  };

  const handleSectionChange = (section) => {
    navigate(`/${section}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeSection={getActiveSection()} 
        setActiveSection={handleSectionChange} 
      />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/health-fitness" element={<HealthFitness />} />
            <Route path="/learning-tools" element={<LearningTools />} />
            <Route path="/finances" element={<FinancesOverview />} />
            <Route path="/medication" element={<DrugAndMed />} />
            <Route path="/project" element={<Project />} />
            <Route path="/workouts/new" element={<HealthFitness />} />
            <Route path="/finances/new" element={<FinancesOverview />} />
            <Route path="/courses/start" element={<LearningTools />} />
            <Route path="/projects/new" element={<Project />} />
            <Route path="/activities" element={<Activities />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;