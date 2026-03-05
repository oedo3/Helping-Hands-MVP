export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          bio: string | null;
          avatar: string;
          interests: string[];
          availability: string[];
          skills: string[];
          distance_pref: number;
          onboarding_complete: boolean;
          total_hours: number;
          impact_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          bio?: string | null;
          avatar?: string;
          interests?: string[];
          availability?: string[];
          skills?: string[];
          distance_pref?: number;
          onboarding_complete?: boolean;
          total_hours?: number;
          impact_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          bio?: string | null;
          avatar?: string;
          interests?: string[];
          availability?: string[];
          skills?: string[];
          distance_pref?: number;
          onboarding_complete?: boolean;
          total_hours?: number;
          impact_points?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          description: string;
          category: string;
          address: string;
          city: string;
          state: string;
          lat: number;
          lng: number;
          logo_url: string | null;
          website: string | null;
          verified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          category: string;
          address: string;
          city: string;
          state: string;
          lat: number;
          lng: number;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          address?: string;
          city?: string;
          state?: string;
          lat?: number;
          lng?: number;
          logo_url?: string | null;
          website?: string | null;
          verified?: boolean;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          description: string;
          category: string;
          address: string;
          lat: number;
          lng: number;
          event_date: string;
          event_time: string;
          duration_hours: number;
          total_spots: number;
          spots_remaining: number;
          image_url: string | null;
          tags: string[];
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          description: string;
          category: string;
          address: string;
          lat: number;
          lng: number;
          event_date: string;
          event_time: string;
          duration_hours?: number;
          total_spots: number;
          spots_remaining?: number;
          image_url?: string | null;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          address?: string;
          lat?: number;
          lng?: number;
          event_date?: string;
          event_time?: string;
          duration_hours?: number;
          total_spots?: number;
          spots_remaining?: number;
          image_url?: string | null;
          tags?: string[];
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "events_organization_id_fkey";
            columns: ["organization_id"];
            isOneToOne: false;
            referencedRelation: "organizations";
            referencedColumns: ["id"];
          }
        ];
      };
      event_signups: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          status: string;
          signed_up_at: string;
          attended_at: string | null;
          hours_logged: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_id: string;
          status?: string;
          signed_up_at?: string;
          attended_at?: string | null;
          hours_logged?: number | null;
        };
        Update: {
          status?: string;
          attended_at?: string | null;
          hours_logged?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "event_signups_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_signups_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          icon: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          icon?: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          read?: boolean;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          show_profile: boolean;
          show_hours: boolean;
          newsletter: boolean;
          notif_new_events: boolean;
          notif_reminders: boolean;
          notif_updates: boolean;
          notif_messages: boolean;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          show_profile?: boolean;
          show_hours?: boolean;
          newsletter?: boolean;
          notif_new_events?: boolean;
          notif_reminders?: boolean;
          notif_updates?: boolean;
          notif_messages?: boolean;
          updated_at?: string;
        };
        Update: {
          show_profile?: boolean;
          show_hours?: boolean;
          newsletter?: boolean;
          notif_new_events?: boolean;
          notif_reminders?: boolean;
          notif_updates?: boolean;
          notif_messages?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
