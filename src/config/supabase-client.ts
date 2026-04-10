import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está definida')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida')
}

/**
 * Cliente browser alinhado com o servidor (@supabase/ssr).
 * Não uses get/set manuais em document.cookie — partiam valores com '=' (JWT)
 * e a sessão não chegava ao layout/API no Next.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
