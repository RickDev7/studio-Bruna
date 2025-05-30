import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import { env } from '@/config/env';

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'As variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias. ' +
    'Adicione-as ao arquivo .env.local'
  );
}

// Criar e exportar o cliente Supabase
export const supabase = createClient<Database>(
  env.supabase.url,
  env.supabase.anonKey
); 