import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PersonalDevelopment from './components/PersonalDevelopment';
import HealthFitness from './components/HealthFitness';
import LearningTools from './components/LearningTools';
import EmailManagement from './components/EmailManagement';
import FinancesOverview from './components/FinancesOverview';
import RegistrationsManagement from './components/RegistrationsManagement';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'health-fitness':
        return <HealthFitness />;
      case 'learning-tools':
        return <LearningTools />;
      case 'emails':
        return <EmailManagement />;
      case 'finances':
        return <FinancesOverview />;
      case 'registrations':
        return <RegistrationsManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
