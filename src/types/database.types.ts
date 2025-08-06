export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'user' | 'admin' | null
          updated_at: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'user' | 'admin' | null
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          service_id: string
          scheduled_at: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled'
          notes: string | null
          user_name: string
          user_email: string
          user_phone: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string
          service_id: string
          scheduled_at: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled'
          notes?: string | null
          user_name: string
          user_email: string
          user_phone: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          service_id?: string
          scheduled_at?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'rescheduled'
          notes?: string | null
          user_name?: string
          user_email?: string
          user_phone?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 