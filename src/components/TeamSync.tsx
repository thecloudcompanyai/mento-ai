import * as React from 'react';
import { ArrowLeft, TrendingUp, Heart, UserPlus } from 'lucide-react';
import FloatingBlobs from './FloatingBlobs';

interface TeamMember {
  name: string;
  mood: number;
  energy: number;
  status: string;
}

interface TeamSyncProps {
  onNavigate: (view: 'dashboard') => void;
}

const TeamSync: React.FC<TeamSyncProps> = ({ onNavigate }) => {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([
    { name: 'Alex', mood: 8, energy: 7, status: 'focused' },
    { name: 'Sam', mood: 6, energy: 5, status: 'calm' },
    { name: 'Jordan', mood: 4, energy: 3, status: 'burnout' },
    { name: 'Casey', mood: 9, energy: 9, status: 'energized' }
  ]);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteName, setInviteName] = React.useState('');
  const [roomCode] = React.useState(() => {
    const saved = localStorage.getItem('mento-room-code');
    if (saved) return saved;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    localStorage.setItem('mento-room-code', code);
    return code;
  });

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😕';
    return '😔';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'calm': return 'bg-[#C2E7FF]/20 border-[#C2E7FF]/30';
      case 'focused': return 'bg-[#D2F8D2]/20 border-[#D2F8D2]/30';
      case 'burnout': return 'bg-[#FFDBD3]/20 border-[#FFDBD3]/30';
      case 'energized': return 'bg-[#FFF6B3]/20 border-[#FFF6B3]/30';
      default: return 'bg-white/20 border-white/30';
    }
  };

  const avgMood = Math.round(teamMembers.reduce((sum: number, member: TeamMember) => sum + member.mood, 0) / teamMembers.length);
  const energySync = Math.round((teamMembers.filter((m: TeamMember) => m.energy >= 6).length / teamMembers.length) * 100);

  return (
    <div className="relative min-h-screen lg:pl-72">
      <FloatingBlobs />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 lg:pb-8">
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
              Team Pulse – Design Squad
            </h1>
            <p className="font-inter text-lg text-[#334155]/70">
              Stay connected with your team's wellbeing
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end">
            <span className="font-mono text-xs text-[#334155]/60">Room Code:</span>
            <span className="font-mono text-lg bg-white/40 px-2 py-1 rounded-lg text-[#334155] tracking-widest select-all">{roomCode}</span>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🌡️</span>
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Avg Team Mood</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">{getMoodEmoji(avgMood)}</span>
              <span className="text-2xl font-sora font-bold text-[#A5E3D8]">{avgMood}/10</span>
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Energy Sync</h3>
            </div>
            <div className="text-2xl font-sora font-bold text-[#A5E3D8]">{energySync}%</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Team Trend</h3>
            </div>
            <p className="text-[#334155]/80 font-inter">Stress rising mid-week</p>
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg mb-8">
          <h3 className="font-sora font-semibold text-xl text-[#334155] mb-6">Team Vibe</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {teamMembers.map((member: TeamMember, index: number) => (
              <div key={index} className={`p-4 rounded-2xl border backdrop-blur-sm ${getStatusColor(member.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-inter font-medium text-[#334155] mb-1">{member.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-[#334155]/70">
                      <span>Mood: {getMoodEmoji(member.mood)} {member.mood}</span>
                      <span>•</span>
                      <span>Energy: ⚡ {member.energy}</span>
                    </div>
                  </div>
                  <div className="capitalize text-sm px-3 py-1 bg-white/30 rounded-full font-inter">
                    {member.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Nudges */}
        <div className="bg-[#C2E7FF]/20 backdrop-blur-sm p-8 rounded-3xl border border-[#C2E7FF]/30 shadow-lg">
          <h3 className="font-sora font-semibold text-xl text-[#334155] mb-4">Team Nudge</h3>
          <p className="font-inter text-lg text-[#334155] mb-6">
            Low connection detected. Suggest async gratitude round.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group bg-[#A5E3D8] text-[#334155] px-6 py-3 rounded-2xl font-inter font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#8DD3C7] hover:scale-105 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Send Gratitude
            </button>
            
            <button
              className="group bg-white/30 text-[#334155] px-6 py-3 rounded-2xl font-inter font-medium border border-white/30 hover:bg-white/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              onClick={() => setShowInviteModal(true)}
            >
              <UserPlus className="w-5 h-5" />
              Invite Member
            </button>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xs flex flex-col gap-4">
            <h4 className="font-sora font-semibold text-lg text-[#334155]">Invite to Team</h4>
            <p className="text-sm text-[#334155]/70">Share this room code to join: <span className='font-mono bg-gray-100 px-2 py-1 rounded'>{roomCode}</span></p>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A5E3D8]"
              placeholder="Enter member name"
              value={inviteName}
              onChange={e => setInviteName(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-[#A5E3D8] text-[#334155] px-4 py-2 rounded-lg font-inter font-medium flex-1 hover:bg-[#8DD3C7]"
                onClick={() => {
                  if (inviteName.trim()) {
                    setTeamMembers([...teamMembers, { name: inviteName.trim(), mood: 5, energy: 5, status: 'calm' }]);
                    setInviteName('');
                    setShowInviteModal(false);
                  }
                }}
              >
                Add Member
              </button>
              <button
                className="bg-gray-200 text-[#334155] px-4 py-2 rounded-lg font-inter font-medium flex-1 hover:bg-gray-300"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamSync;