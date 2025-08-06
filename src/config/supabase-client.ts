import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida');
}

export function createClient() {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      cookies: {
        get: (name: string) => {
          if (typeof document === 'undefined') return ''
          const cookie = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
          return cookie ? cookie.split('=')[1] : ''
        },
        set: (name: string, value: string, options: { path?: string; maxAge?: number }) => {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=${value}; path=${options.path || '/'}`
        },
        remove: (name: string, options: { path?: string }) => {
          if (typeof document === 'undefined') return
          document.cookie = `${name}=; path=${options.path || '/'}`
        }
      }
    }
  );
} 