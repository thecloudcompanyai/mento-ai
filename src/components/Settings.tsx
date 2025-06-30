import React, { useState } from 'react';
import { ArrowLeft, User, Bell, Users, Calendar, Slack, Download, RotateCcw, LogOut } from 'lucide-react';
import { User as UserType } from '../types';
import { useAuth } from '../hooks/useAuth';
import FloatingBlobs from './FloatingBlobs';

interface SettingsProps {
  user: UserType;
  onUpdateProfile: (updates: Partial<Pick<UserType, 'name' | 'mode' | 'dailyReminderTime'>>) => Promise<any>;
  onNavigate: (view: 'dashboard') => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateProfile, onNavigate }) => {
  const { signOut } = useAuth();
  const [name, setName] = useState(user.name);
  const [reminderTime, setReminderTime] = useState(user.dailyReminderTime);
  const [mode, setMode] = useState<'solo' | 'team'>(user.mode);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateProfile({
        name,
        dailyReminderTime: reminderTime,
        mode
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    const data = {
      profile: {
        name: user.name,
        email: user.email,
        mode: user.mode
      },
      moodHistory: user.moodHistory,
      energyHistory: user.energyHistory,
      checkIns: user.lastCheckIn ? [user.lastCheckIn] : [],
      journalEntries: user.journalEntries.map(entry => ({
        ...entry,
        timestamp: entry.timestamp.toISOString()
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mento-data-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  return (
    <div className="relative min-h-screen lg:pl-72">
      <FloatingBlobs />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 mr-4 lg:hidden"
          >
            <ArrowLeft className="w-5 h-5 text-[#334155]" />
          </button>
          <div>
            <h1 className="font-sora font-semibold text-3xl text-[#334155] mb-2">
              Settings
            </h1>
            <p className="font-inter text-lg text-[#334155]/70">
              Customize your Mento experience
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile */}
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-xl text-[#334155]">Profile</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-inter font-medium text-[#334155] mb-2">Name</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={handleSave}
                  className="w-full p-4 bg-white/50 border border-white/30 rounded-2xl font-inter text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#A5E3D8]/50"
                />
              </div>

              <div>
                <label className="block font-inter font-medium text-[#334155] mb-2">Email</label>
                <input 
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full p-4 bg-white/30 border border-white/30 rounded-2xl font-inter text-[#334155]/70 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block font-inter font-medium text-[#334155] mb-2">Avatar</label>
                <div className="w-16 h-16 bg-[#A5E3D8] rounded-full flex items-center justify-center text-2xl font-sora font-bold text-[#334155]">
                  {name.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-xl text-[#334155]">Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block font-inter font-medium text-[#334155] mb-2">Daily reminder time</label>
                <input 
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  onBlur={handleSave}
                  className="w-full p-4 bg-white/50 border border-white/30 rounded-2xl font-inter text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#A5E3D8]/50"
                />
              </div>
              
              <div>
                <label className="block font-inter font-medium text-[#334155] mb-3">Mode</label>
                <div className="flex gap-3">
                  <button 
                    onClick={() => { setMode('solo'); handleSave(); }}
                    className={`px-6 py-3 rounded-2xl font-inter font-medium transition-all duration-300 ${
                      mode === 'solo' 
                        ? 'bg-[#A5E3D8] text-[#334155] shadow-md' 
                        : 'bg-white/30 text-[#334155]/70 hover:bg-white/50'
                    }`}
                  >
                    🧘 Solo Mode
                  </button>
                  <button 
                    onClick={() => { setMode('team'); handleSave(); }}
                    className={`px-6 py-3 rounded-2xl font-inter font-medium transition-all duration-300 ${
                      mode === 'team' 
                        ? 'bg-[#A5E3D8] text-[#334155] shadow-md' 
                        : 'bg-white/30 text-[#334155]/70 hover:bg-white/50'
                    }`}
                  >
                    🤝 Team Mode
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-xl text-[#334155]">Connect Tools</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 bg-white/30 rounded-2xl font-inter text-[#334155]/70 flex items-center gap-3 hover:bg-white/50 transition-all duration-300">
                <Calendar className="w-5 h-5" />
                Google Calendar (Coming Soon)
              </button>
              <button className="w-full p-4 bg-white/30 rounded-2xl font-inter text-[#334155]/70 flex items-center gap-3 hover:bg-white/50 transition-all duration-300">
                <Slack className="w-5 h-5" />
                Slack (Coming Soon)
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Download className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-xl text-[#334155]">⚙️ Data</h3>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleExport}
                className="w-full p-4 bg-white/30 rounded-2xl font-inter text-[#334155] flex items-center gap-3 hover:bg-white/50 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Export all data
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <LogOut className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-xl text-[#334155]">Account</h3>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="w-full p-4 bg-[#FFDBD3]/30 rounded-2xl font-inter text-[#334155] flex items-center gap-3 hover:bg-[#FFDBD3]/50 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              🚪 Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;