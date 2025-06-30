import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useUserData } from './hooks/useUserData';
import AuthForm from './components/AuthForm';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import TeamSync from './components/TeamSync';
import Settings from './components/Settings';
import History from './components/History';
import Journal from './components/Journal';
import MentoAI from './components/MentoAI';
import Navigation from './components/Navigation';

function App() {
  const { user: authUser, loading: authLoading } = useAuth();
  const { user, loading: userLoading, updateProfile, saveCheckIn, saveJournalEntry, updateJournalEntry, deleteJournalEntry } = useUserData(authUser?.id || null);
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'checkin' | 'team' | 'settings' | 'history' | 'journal' | 'mento'>('dashboard');

  const navigateTo = (view: 'landing' | 'dashboard' | 'checkin' | 'team' | 'settings' | 'history' | 'journal' | 'mento') => {
    setCurrentView(view);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] to-[#E6F0FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A5E3D8]/30 border-t-[#A5E3D8] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-inter text-[#334155]/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!authUser) {
    return <AuthForm />;
  }

  // Show loading while fetching user data
  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] to-[#E6F0FF] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A5E3D8]/30 border-t-[#A5E3D8] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-inter text-[#334155]/70">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  // Show error if user data couldn't be loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] to-[#E6F0FF] flex items-center justify-center">
        <div className="text-center">
          <p className="font-inter text-[#334155]/70">Error loading user data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'checkin':
        return <CheckIn user={user} onSaveCheckIn={saveCheckIn} onNavigate={navigateTo} />;
      case 'team':
        return <TeamSync onNavigate={navigateTo} />;
      case 'settings':
        return <Settings user={user} onUpdateProfile={updateProfile} onNavigate={navigateTo} />;
      case 'history':
        return <History user={user} onNavigate={navigateTo} />;
      case 'journal':
        return <Journal 
          user={user} 
          onSaveEntry={saveJournalEntry}
          onUpdateEntry={updateJournalEntry}
          onDeleteEntry={deleteJournalEntry}
          onNavigate={navigateTo} 
        />;
      case 'mento':
        return <MentoAI user={user} onNavigate={navigateTo} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F9FC] to-[#E6F0FF] relative overflow-hidden">
      <Navigation 
        currentView={currentView} 
        onNavigate={navigateTo} 
        userMode={user.mode}
      />
      {renderView()}
    </div>
  );
}

export default App;