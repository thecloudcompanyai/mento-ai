import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import TeamSync from './components/TeamSync';
import Settings from './components/Settings';
import History from './components/History';
import Journal from './components/Journal';
import MentoAI from './components/MentoAI';
import Navigation from './components/Navigation';
import { User } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'checkin' | 'team' | 'settings' | 'history' | 'journal' | 'mento'>('landing');
  const [user, setUser] = useState<User>({
    name: 'Alex',
    mode: 'solo',
    dailyReminderTime: '09:00',
    lastCheckIn: null,
    moodHistory: [
      { date: '2024-01-15', mood: 8 },
      { date: '2024-01-14', mood: 6 },
      { date: '2024-01-13', mood: 7 },
      { date: '2024-01-12', mood: 5 },
      { date: '2024-01-11', mood: 9 },
      { date: '2024-01-10', mood: 7 },
      { date: '2024-01-09', mood: 6 }
    ],
    energyHistory: [
      { date: '2024-01-15', energy: 7 },
      { date: '2024-01-14', energy: 5 },
      { date: '2024-01-13', energy: 8 },
      { date: '2024-01-12', energy: 4 },
      { date: '2024-01-11', energy: 9 },
      { date: '2024-01-10', energy: 6 },
      { date: '2024-01-09', energy: 5 }
    ],
    journalEntries: []
  });

  const navigateTo = (view: 'landing' | 'dashboard' | 'checkin' | 'team' | 'settings' | 'history' | 'journal' | 'mento') => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={navigateTo} />;
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'checkin':
        return <CheckIn user={user} setUser={setUser} onNavigate={navigateTo} />;
      case 'team':
        return <TeamSync onNavigate={navigateTo} />;
      case 'settings':
        return <Settings user={user} setUser={setUser} onNavigate={navigateTo} />;
      case 'history':
        return <History user={user} onNavigate={navigateTo} />;
      case 'journal':
        return <Journal user={user} setUser={setUser} onNavigate={navigateTo} />;
      case 'mento':
        return <MentoAI user={user} onNavigate={navigateTo} />;
      default:
        return <LandingPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] to-[#E6F0FF] relative overflow-hidden">
      {currentView !== 'landing' && (
        <Navigation 
          currentView={currentView} 
          onNavigate={navigateTo} 
          userMode={user.mode}
        />
      )}
      {renderView()}
    </div>
  );
}

export default App;