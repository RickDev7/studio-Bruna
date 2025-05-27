import { createClient } from '@supabase/supabase-js';

// Tipos para a base de dados
export type Database = {
  public: {
    Tables: {
      pedidos: {
        Row: {
          id: string;
          nome: string;
          email: string;
          valor: string;
          status: "pendente" | "pago";
          data_pagamento: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['pedidos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['pedidos']['Row']>;
      };
    };
  };
};

// Configuração do Supabase
const supabaseUrl = "https://pxvdkqqsvtuwdorvinrd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4dmRrcXFzdnR1d2RvcnZpbnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzODE1NTgsImV4cCI6MjA2Mzk1NzU1OH0.9qahoZDGaZY1lAqUogZ9s4SaBsJB8E3RQouR7m7wqDU";

// Cliente do Supabase com tipagem
export const supabase = createClient<Database>(supabaseUrl, supabaseKey); 