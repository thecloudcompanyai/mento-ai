import React from 'react';
import { Home, BarChart3, BookOpen, Bot, Users, Settings, History, PlusCircle } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: 'dashboard' | 'checkin' | 'team' | 'settings' | 'history' | 'journal' | 'mento') => void;
  userMode: 'solo' | 'team';
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate, userMode }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'text-[#A5E3D8]' },
    { id: 'checkin', icon: PlusCircle, label: 'Check In', color: 'text-[#A5E3D8]' },
    { id: 'history', icon: BarChart3, label: 'Analytics', color: 'text-[#C2E7FF]' },
    { id: 'journal', icon: BookOpen, label: 'Journal', color: 'text-[#D2F8D2]' },
    { id: 'mento', icon: Bot, label: 'Mento AI', color: 'text-[#FFF6B3]' },
    ...(userMode === 'team' ? [{ id: 'team', icon: Users, label: 'Team', color: 'text-[#FFDBD3]' }] : []),
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-[#334155]' }
  ];

  return (
    <>
      {/* Desktop Navigation - Left Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-72">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/10 backdrop-blur-xl border-r border-white/20 px-6 py-8">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#A5E3D8]/20 rounded-xl">
                <Bot className="w-8 h-8 text-[#A5E3D8]" />
              </div>
              <div>
                <h1 className="font-sora font-bold text-xl text-[#334155]">Mento AI</h1>
                <p className="font-inter text-sm text-[#334155]/60">Mind in sync</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id as any)}
                      className={`group flex gap-x-3 rounded-2xl p-4 text-sm font-medium leading-6 w-full transition-all duration-300 ${
                        isActive
                          ? 'bg-white/20 text-[#334155] shadow-lg backdrop-blur-sm border border-white/30'
                          : 'text-[#334155]/70 hover:text-[#334155] hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`h-6 w-6 shrink-0 ${isActive ? item.color : 'text-[#334155]/50'}`} />
                      <span className="font-inter">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation - Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/20">
        <div className="flex justify-around items-center py-2 px-4">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 text-[#334155]'
                    : 'text-[#334155]/60 hover:text-[#334155]'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-[#334155]/50'}`} />
                <span className="font-inter text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;