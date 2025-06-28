export interface User {
  name: string;
  mode: 'solo' | 'team';
  dailyReminderTime: string;
  lastCheckIn: CheckInData | null;
  moodHistory: MoodEntry[];
  energyHistory: EnergyEntry[];
  journalEntries: JournalEntry[];
}

export interface CheckInData {
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