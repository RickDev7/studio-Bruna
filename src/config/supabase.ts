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

let supabase: ReturnType<typeof createClient<Database>> | null = null;

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabase = createClient<Database>(supabaseUrl, supabaseKey);
}

export { supabase }; 