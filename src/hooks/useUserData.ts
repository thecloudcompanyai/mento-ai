import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, CheckInData, JournalEntry, MoodEntry, EnergyEntry } from '../types';

export const useUserData = (userId: string | null) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    if (!userId) return;

    try {
      // Load profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Load check-ins
      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (checkInsError) throw checkInsError;

      // Load journal entries
      const { data: journalEntries, error: journalError } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (journalError) throw journalError;

      // Process data
      const moodHistory: MoodEntry[] = checkIns?.map(checkIn => ({
        date: new Date(checkIn.created_at).toISOString().split('T')[0],
        mood: checkIn.mood
      })) || [];

      const energyHistory: EnergyEntry[] = checkIns?.map(checkIn => ({
        date: new Date(checkIn.created_at).toISOString().split('T')[0],
        energy: checkIn.energy
      })) || [];

      const lastCheckIn: CheckInData | null = checkIns?.[0] ? {
        id: checkIns[0].id,
        mood: checkIns[0].mood,
        energy: checkIns[0].energy,
        notes: checkIns[0].notes || undefined,
        tags: checkIns[0].tags || [],
        timestamp: new Date(checkIns[0].created_at)
      } : null;

      const processedJournalEntries: JournalEntry[] = journalEntries?.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags || [],
        timestamp: new Date(entry.created_at)
      })) || [];

      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        mode: profile.mode,
        dailyReminderTime: profile.daily_reminder_time,
        lastCheckIn,
        moodHistory,
        energyHistory,
        journalEntries: processedJournalEntries
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Pick<User, 'name' | 'mode' | 'dailyReminderTime'>>) => {
    if (!userId || !user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        mode: updates.mode,
        daily_reminder_time: updates.dailyReminderTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const saveCheckIn = async (checkInData: Omit<CheckInData, 'id' | 'timestamp'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('check_ins')
      .insert({
        user_id: userId,
        mood: checkInData.mood,
        energy: checkInData.energy,
        notes: checkInData.notes || null,
        tags: checkInData.tags
      })
      .select()
      .single();

    if (error) throw error;

    // Reload user data to update history
    await loadUserData();
    return data;
  };

  const saveJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title: entry.title,
        content: entry.content,
        mood: entry.mood,
        tags: entry.tags
      })
      .select()
      .single();

    if (error) throw error;

    // Reload user data to update journal entries
    await loadUserData();
    return data;
  };

  const updateJournalEntry = async (entryId: string, updates: Partial<Omit<JournalEntry, 'id' | 'timestamp'>>) => {
    if (!userId) return;

    const { error } = await supabase
      .from('journal_entries')
      .update({
        title: updates.title,
        content: updates.content,
        mood: updates.mood,
        tags: updates.tags,
        updated_at: new Date().toISOString()
      })
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw error;

    // Reload user data
    await loadUserData();
  };

  const deleteJournalEntry = async (entryId: string) => {
    if (!userId) return;

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) throw error;

    // Reload user data
    await loadUserData();
  };

  return {
    user,
    loading,
    updateProfile,
    saveCheckIn,
    saveJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    refreshData: loadUserData
  };
};