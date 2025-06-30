export interface User {
  id: string;
  email: string;
  name: string;
  mode: 'solo' | 'team';
  dailyReminderTime: string;
  lastCheckIn: CheckInData | null;
  moodHistory: MoodEntry[];
  energyHistory: EnergyEntry[];
  journalEntries: JournalEntry[];
}

export interface CheckInData {
  id?: string;
  mood: number;
  energy: number;
  notes?: string;
  tags: string[];
  timestamp: Date;
}

export interface MoodEntry {
  date: string;
  mood: number;
}

export interface EnergyEntry {
  date: string;
  energy: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: number;
  tags: string[];
  timestamp: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  mood: number;
  energy: number;
  lastActive: Date;
}

export interface AuthUser {
  id: string;
  email: string;
}