export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          mode: 'solo' | 'team';
          daily_reminder_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          mode?: 'solo' | 'team';
          daily_reminder_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          mode?: 'solo' | 'team';
          daily_reminder_time?: string;
          updated_at?: string;
        };
      };
      check_ins: {
        Row: {
          id: string;
          user_id: string;
          mood: number;
          energy: number;
          notes: string | null;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mood: number;
          energy: number;
          notes?: string | null;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mood?: number;
          energy?: number;
          notes?: string | null;
          tags?: string[];
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          mood: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          mood: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          mood?: number;
          tags?: string[];
          updated_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_code: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_code: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          team_code?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}