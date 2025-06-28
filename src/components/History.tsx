import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { User } from '../types';
import FloatingBlobs from './FloatingBlobs';

interface HistoryProps {
  user: User;
  onNavigate: (view: 'dashboard') => void;
}

const History: React.FC<HistoryProps> = ({ user, onNavigate }) => {
  const [viewType, setViewType] = useState<'mood' | 'energy'>('mood');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '🙂';
    if (mood >= 4) return '😐';
    if (mood >= 2) return '😕';
    return '😔';
  };

  const getFilteredData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = viewType === 'mood' ? user.moodHistory : user.energyHistory;
    return data.slice(-days);
  };

  const getAverage = () => {
    const data = getFilteredData();
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, entry) => acc + (viewType === 'mood' ? entry.mood : (entry as any).energy), 0);
    return Math.round(sum / data.length);
  };

  const getTrend = () => {
    const data = getFilteredData();
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(-3);
    const earlier = data.slice(-6, -3);
    
    const recentAvg = recent.reduce((acc, entry) => acc + (viewType === 'mood' ? entry.mood : (entry as any).energy), 0) / recent.length;
    const earlierAvg = earlier.reduce((acc, entry) => acc + (viewType === 'mood' ? entry.mood : (entry as any).energy), 0) / earlier.length;
    
    if (recentAvg > earlierAvg + 0.5) return 'improving';
    if (recentAvg < earlierAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getMaxValue = () => {
    const data = getFilteredData();
    return Math.max(...data.map(entry => viewType === 'mood' ? entry.mood : (entry as any).energy));
  };

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
              Analytics & Insights
            </h1>
            <p className="font-inter text-lg text-[#334155]/70">
              Track your mental wellness journey over time
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewType('mood')}
              className={`px-6 py-3 rounded-2xl font-inter font-medium transition-all duration-300 ${
                viewType === 'mood' 
                  ? 'bg-[#A5E3D8] text-[#334155] shadow-md' 
                  : 'bg-white/30 text-[#334155]/70 hover:bg-white/50'
              }`}
            >
              🧠 Mood
            </button>
            <button 
              onClick={() => setViewType('energy')}
              className={`px-6 py-3 rounded-2xl font-inter font-medium transition-all duration-300 ${
                viewType === 'energy' 
                  ? 'bg-[#A5E3D8] text-[#334155] shadow-md' 
                  : 'bg-white/30 text-[#334155]/70 hover:bg-white/50'
              }`}
            >
              ⚡ Energy
            </button>
          </div>
          
          <div className="flex gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button 
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-3 rounded-2xl font-inter font-medium transition-all duration-300 ${
                  timeRange === range 
                    ? 'bg-[#A5E3D8] text-[#334155] shadow-md' 
                    : 'bg-white/30 text-[#334155]/70 hover:bg-white/50'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Average</h3>
            </div>
            <div className="text-3xl font-sora font-bold text-[#A5E3D8]">{getAverage()}/10</div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Trend</h3>
            </div>
            <div className="text-lg font-inter text-[#334155] capitalize">
              {getTrend() === 'improving' && '📈 Improving'}
              {getTrend() === 'declining' && '📉 Needs attention'}
              {getTrend() === 'stable' && '➡️ Stable'}
            </div>
          </div>

          <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl border border-white/30 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-6 h-6 text-[#A5E3D8]" />
              <h3 className="font-sora font-semibold text-lg text-[#334155]">Peak</h3>
            </div>
            <div className="text-3xl font-sora font-bold text-[#A5E3D8]">{getMaxValue()}/10</div>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="bg-white/20 backdrop-blur-sm p-8 rounded-3xl border border-white/30 shadow-lg mb-8">
          <h3 className="font-sora font-semibold text-xl text-[#334155] mb-6">
            {viewType === 'mood' ? '🧠 Mood' : '⚡ Energy'} Trends
          </h3>
          
          <div className="space-y-4">
            {getFilteredData().reverse().map((entry, index) => {
              const value = viewType === 'mood' ? entry.mood : (entry as any).energy;
              const percentage = (value / 10) * 100;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-inter text-[#334155]/70">
                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        viewType === 'mood' 
                          ? 'bg-gradient-to-r from-[#A5E3D8] to-[#8DD3C7]'
                          : 'bg-gradient-to-r from-[#FFF6B3] to-[#F59E0B]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 w-16">
                    {viewType === 'mood' && <span className="text-lg">{getMoodEmoji(value)}</span>}
                    <span className="font-sora font-semibold text-[#334155]">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-[#C2E7FF]/20 backdrop-blur-sm p-8 rounded-3xl border border-[#C2E7FF]/30 shadow-lg">
          <h3 className="font-sora font-semibold text-xl text-[#334155] mb-4">📊 Pattern Insights</h3>
          <div className="space-y-3">
            <p className="font-inter text-[#334155]">
              • Your {viewType} has been {getTrend()} over the past {timeRange}
            </p>
            <p className="font-inter text-[#334155]">
              • Average {viewType} score: {getAverage()}/10
            </p>
            <p className="font-inter text-[#334155]">
              • Best day reached {getMaxValue()}/10 - keep up the great work! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;