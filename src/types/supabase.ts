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
          full_name: string
          phone: string | null
          role: string | null
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          full_name: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: string | null
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          user_id: string
          service: string
          date: string
          time: string
          status: 'pending' | 'confirmed' | 'cancelled'
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          service: string
          date: string
          time: string
          status?: 'pending' | 'confirmed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          service?: string
          date?: string
          time?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
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