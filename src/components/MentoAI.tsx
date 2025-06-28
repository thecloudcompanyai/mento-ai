import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot, User as UserIcon } from 'lucide-react';
import { User } from '../types';
import FloatingBlobs from './FloatingBlobs';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface MentoAIProps {
  user: User;
  onNavigate: (view: 'dashboard') => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const MentoAI: React.FC<MentoAIProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use the provided API key
  const API_KEY = 'AIzaSyBZNW7JaDx3Z9iYwCFmuPbfOnECVbAIFzo';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isInitialized) {
      initializeMento();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const generateUserContext = () => {
    const recentMoodAvg = user.moodHistory.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.max(user.moodHistory.slice(-7).length, 1);
    const recentEnergyAvg = user.energyHistory.slice(-7).reduce((sum, entry) => sum + entry.energy, 0) / Math.max(user.energyHistory.slice(-7).length, 1);
    
    const moodTrend = user.moodHistory.length >= 6 ? 
      (user.moodHistory.slice(-3).reduce((sum, entry) => sum + entry.mood, 0) / 3) - 
      (user.moodHistory.slice(-6, -3).reduce((sum, entry) => sum + entry.mood, 0) / 3) : 0;

    const energyTrend = user.energyHistory.length >= 6 ? 
      (user.energyHistory.slice(-3).reduce((sum, entry) => sum + entry.energy, 0) / 3) - 
      (user.energyHistory.slice(-6, -3).reduce((sum, entry) => sum + entry.energy, 0) / 3) : 0;

    const recentJournals = user.journalEntries.slice(0, 3).map(entry => ({
      title: entry.title,
      mood: entry.mood,
      tags: entry.tags,
      contentPreview: entry.content.substring(0, 200)
    }));

    return {
      name: user.name,
      mode: user.mode,
      currentMood: user.lastCheckIn?.mood || Math.round(recentMoodAvg),
      currentEnergy: user.lastCheckIn?.energy || Math.round(recentEnergyAvg),
      weeklyMoodAvg: Math.round(recentMoodAvg * 10) / 10,
      weeklyEnergyAvg: Math.round(recentEnergyAvg * 10) / 10,
      moodTrend: moodTrend > 0.5 ? 'improving' : moodTrend < -0.5 ? 'declining' : 'stable',
      energyTrend: energyTrend > 0.5 ? 'improving' : energyTrend < -0.5 ? 'declining' : 'stable',
      totalCheckIns: user.moodHistory.length,
      journalCount: user.journalEntries.length,
      recentJournals,
      lastCheckInNotes: user.lastCheckIn?.notes,
      lastCheckInTags: user.lastCheckIn?.tags || []
    };
  };

  const generateAIResponse = async (userMessage: string, isInitial = false) => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const userContext = generateUserContext();
      
      const systemPrompt = `You are Mento, an empathetic AI wellness companion designed to help individuals and teams maintain mental wellness while staying productive. You have access to detailed user data and should provide personalized, actionable insights.

CORE PERSONALITY:
- Warm, supportive, and non-judgmental
- Focus on balance between mental wellness and productivity
- Provide practical, actionable advice
- Use gentle, encouraging language
- Be concise but meaningful (150-200 words max)
- Use emojis sparingly but meaningfully

USER CONTEXT:
Name: ${userContext.name}
Mode: ${userContext.mode}
Current Mood: ${userContext.currentMood}/10
Current Energy: ${userContext.currentEnergy}/10
Weekly Mood Average: ${userContext.weeklyMoodAvg}/10
Weekly Energy Average: ${userContext.weeklyEnergyAvg}/10
Mood Trend: ${userContext.moodTrend}
Energy Trend: ${userContext.energyTrend}
Total Check-ins: ${userContext.totalCheckIns}
Journal Entries: ${userContext.journalCount}
Recent Journal Topics: ${userContext.recentJournals.map(j => `"${j.title}" (mood: ${j.mood}, tags: ${j.tags.join(', ')})`).join('; ')}
Last Check-in Notes: ${userContext.lastCheckInNotes || 'None'}
Last Check-in Tags: ${userContext.lastCheckInTags.join(', ') || 'None'}

CAPABILITIES:
1. Analyze mood and energy patterns
2. Provide personalized wellness recommendations
3. Suggest productivity strategies that support mental health
4. Help interpret journal entries and emotional patterns
5. ${userContext.mode === 'team' ? 'Offer team collaboration and culture insights' : 'Focus on individual growth and self-care'}
6. Identify potential burnout or stress patterns
7. Recommend mindfulness and self-care practices

GUIDELINES:
- Never provide medical advice or diagnose conditions
- Always suggest professional help for serious mental health concerns
- Focus on preventive wellness and positive habits
- Encourage regular check-ins and journaling
- Help balance productivity with self-care
- ${userContext.mode === 'team' ? 'Consider team dynamics and collective wellbeing' : 'Focus on personal development'}

RESPONSE STYLE:
- Start with acknowledgment of their current state
- Provide 1-2 specific, actionable insights
- End with encouragement or a gentle suggestion
- Use "you" language to make it personal
- Keep responses conversational and supportive`;

      let prompt;
      if (isInitial) {
        prompt = `${systemPrompt}

This is your first interaction with ${userContext.name}. Provide a warm, personalized greeting that acknowledges their current wellness state and offers to help. Reference their recent patterns if available, and ask how you can best support them today.`;
      } else {
        prompt = `${systemPrompt}

User message: "${userMessage}"

Respond helpfully based on their message and the context provided. If they're asking for analysis, provide insights based on their data. If they need support, offer practical wellness strategies.`;
      }
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble connecting right now. Please try again in a moment. In the meantime, remember that taking care of your mental wellness is always a priority. 🤖💙";
    }
  };

  const initializeMento = async () => {
    setIsLoading(true);
    try {
      const welcomeMessage = await generateAIResponse('', true);
      
      const aiMessage: Message = {
        id: '1',
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date()
      };

      setMessages([aiMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: '1',
        type: 'ai',
        content: `Hello ${user.name}! 👋 I'm Mento, your AI wellness companion. I'm here to help you maintain mental wellness while staying productive. I can analyze your mood patterns, provide personalized insights, and suggest ways to improve your wellbeing. How are you feeling today?`,
        timestamp: new Date()
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I'm having trouble responding right now. Please try again! In the meantime, remember that small steps toward wellness make a big difference. 🤖",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative min-h-screen lg:pl-72">
      <FloatingBlobs />
      
      <div className="relative z-10 h-screen flex flex-col">
        {/* Minimal Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 mr-3 lg:hidden"
              >
                <ArrowLeft className="w-4 h-4 text-[#334155]" />
              </button>
              <div>
                <h1 className="font-sora font-semibold text-xl sm:text-2xl lg:text-3xl text-[#334155] mb-1">
                  Chat with Mento
                </h1>
                <p className="font-inter text-sm sm:text-base lg:text-lg text-[#334155]/70">
                  Your AI wellness companion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Screen Chat Container */}
        <div className="flex-1 mx-3 sm:mx-4 lg:mx-8 mb-3 sm:mb-4 bg-white/20 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/30 shadow-lg flex flex-col overflow-hidden">
          {/* Messages - Takes up most of the screen */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 sm:gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 p-3 sm:p-3.5 rounded-full ${message.type === 'user' ? 'bg-[#A5E3D8]' : 'bg-white/30'}`}>
                    {message.type === 'user' ? (
                      <UserIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#334155]" />
                    ) : (
                      <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#334155]" />
                    )}
                  </div>
                  <div className={`p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl ${
                    message.type === 'user' 
                      ? 'bg-[#A5E3D8] text-[#334155]' 
                      : 'bg-white/30 text-[#334155]'
                  } shadow-lg`}>
                    <p className="font-inter leading-relaxed whitespace-pre-wrap text-sm sm:text-base lg:text-lg">{message.content}</p>
                    <p className="text-xs sm:text-sm opacity-70 mt-3 sm:mt-4">
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 sm:gap-4 justify-start">
                <div className="flex gap-3 sm:gap-4 max-w-[85%] sm:max-w-[80%] lg:max-w-[75%]">
                  <div className="flex-shrink-0 p-3 sm:p-3.5 rounded-full bg-white/30">
                    <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-[#334155]" />
                  </div>
                  <div className="p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white/30 text-[#334155] shadow-lg">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-[#A5E3D8] rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-[#A5E3D8] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 bg-[#A5E3D8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Large Input Area */}
          <div className="flex-shrink-0 p-4 sm:p-6 lg:p-8 border-t border-white/20">
            <div className="flex gap-3 sm:gap-4">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your wellness patterns, get personalized insights, or share what's on your mind..."
                className="flex-1 p-4 sm:p-5 lg:p-6 bg-white/50 border border-white/30 rounded-2xl sm:rounded-3xl font-inter text-sm sm:text-base lg:text-lg text-[#334155] placeholder-[#334155]/50 focus:outline-none focus:ring-2 focus:ring-[#A5E3D8]/50 resize-none shadow-inner min-h-[60px] sm:min-h-[80px]"
                rows={3}
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="flex-shrink-0 p-4 sm:p-5 lg:p-6 bg-[#A5E3D8] text-[#334155] rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-[#8DD3C7] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-95"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentoAI;