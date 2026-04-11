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
      services: {
        Row: {
          id: string
          name: string
          category: string
          duration: number
          price: number
          description: string | null
          active: boolean | null
          created_at: string
          updated_at: string
          estimated_cost: number
        }
        Insert: {
          id?: string
          name: string
          category: string
          duration: number
          price: number
          description?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          estimated_cost?: number
        }
        Update: {
          id?: string
          name?: string
          category?: string
          duration?: number
          price?: number
          description?: string | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
          estimated_cost?: number
        }
      }
      service_logs: {
        Row: {
          id: string
          service_id: string | null
          quantity: number
          total_revenue: number
          total_cost: number
          profit: number
          created_at: string
          client_name: string | null
          service_name: string | null
          total_price: number
          advance_paid: number
          remaining_paid: number
          payment_method: 'cash' | 'card' | 'mixed'
        }
        Insert: {
          id?: string
          service_id?: string | null
          quantity?: number
          total_revenue: number
          total_cost: number
          profit: number
          created_at?: string
          client_name?: string | null
          service_name?: string | null
          total_price: number
          advance_paid?: number
          remaining_paid?: number
          payment_method?: 'cash' | 'card' | 'mixed'
        }
        Update: {
          id?: string
          service_id?: string | null
          quantity?: number
          total_revenue?: number
          total_cost?: number
          profit?: number
          created_at?: string
          client_name?: string | null
          service_name?: string | null
          total_price?: number
          advance_paid?: number
          remaining_paid?: number
          payment_method?: 'cash' | 'card' | 'mixed'
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
      payments: {
        Row: {
          id: string
          title: string
          amount: number
          status: 'pending' | 'paid'
          due_date: string
          is_recurring: boolean
          recurrence_type: 'monthly' | 'weekly' | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          amount: number
          status?: 'pending' | 'paid'
          due_date: string
          is_recurring?: boolean
          recurrence_type?: 'monthly' | 'weekly' | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          amount?: number
          status?: 'pending' | 'paid'
          due_date?: string
          is_recurring?: boolean
          recurrence_type?: 'monthly' | 'weekly' | null
          created_at?: string
        }
      }
      financial_logs: {
        Row: {
          id: string
          total_balance: number
          base_security: number
          stock_reserved: number
          net_balance: number
          salary: number
          investment: number
          emergency: number
          created_at: string
        }
        Insert: {
          id?: string
          total_balance: number
          base_security?: number
          stock_reserved?: number
          net_balance: number
          salary: number
          investment: number
          emergency: number
          created_at?: string
        }
        Update: {
          id?: string
          total_balance?: number
          base_security?: number
          stock_reserved?: number
          net_balance?: number
          salary?: number
          investment?: number
          emergency?: number
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          stock: number
          min_stock: number
          unit_price: number | null
          unit_type: string
          cost_per_unit: number | null
          total_value: number
          sale_price: number | null
        }
        Insert: {
          id?: string
          name: string
          stock?: number
          min_stock?: number
          unit_price?: number | null
          unit_type?: string
          cost_per_unit?: number | null
          total_value?: number
          sale_price?: number | null
        }
        Update: {
          id?: string
          name?: string
          stock?: number
          min_stock?: number
          unit_price?: number | null
          unit_type?: string
          cost_per_unit?: number | null
          total_value?: number
          sale_price?: number | null
        }
      }
      cash_flow: {
        Row: {
          id: string
          type: 'income' | 'expense'
          category:
            | 'stock'
            | 'service'
            | 'service_advance'
            | 'service_payment'
            | 'other'
            | 'product_sale'
            | 'fixed_cost'
          amount: number
          description: string
          stock_movement_id: string | null
          payment_id: string | null
          service_log_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          type: 'income' | 'expense'
          category:
            | 'stock'
            | 'service'
            | 'service_advance'
            | 'service_payment'
            | 'other'
            | 'product_sale'
            | 'fixed_cost'
          amount: number
          description: string
          stock_movement_id?: string | null
          payment_id?: string | null
          service_log_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          type?: 'income' | 'expense'
          category?:
            | 'stock'
            | 'service'
            | 'service_advance'
            | 'service_payment'
            | 'other'
            | 'product_sale'
            | 'fixed_cost'
          amount?: number
          description?: string
          stock_movement_id?: string | null
          payment_id?: string | null
          service_log_id?: string | null
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          product_id: string
          type: 'in' | 'out'
          quantity: number
          unit_type: string | null
          unit_price: number | null
          total_price: number | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          type: 'in' | 'out'
          quantity: number
          unit_type?: string | null
          unit_price?: number | null
          total_price?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          type?: 'in' | 'out'
          quantity?: number
          unit_type?: string | null
          unit_price?: number | null
          total_price?: number | null
          created_at?: string
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