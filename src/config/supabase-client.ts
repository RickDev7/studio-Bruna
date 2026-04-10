import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'

/**
 * Valores só para `next build` / prerender quando as env ainda não existem (ex.: Vercel).
 * Em produção define NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no painel.
 */
const BUILD_PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const BUILD_PLACEHOLDER_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1OTUyMDAsImV4cCI6MTk1ODE3MTIwMH0.invalid'

let warnedMissingEnv = false

/** Indica se as variáveis públicas do Supabase estão definidas (cliente usa o teu projeto). */
export function isSupabaseEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  )
}

/**
 * Cliente browser alinhado com o servidor (@supabase/ssr).
 * Não uses get/set manuais em document.cookie — partiam valores com '=' (JWT)
 * e a sessão não chegava ao layout/API no Next.
 */
export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || BUILD_PLACEHOLDER_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    BUILD_PLACEHOLDER_ANON_KEY

  if (
    (!process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()) &&
    !warnedMissingEnv
  ) {
    warnedMissingEnv = true
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[supabase] NEXT_PUBLIC_SUPABASE_URL / ANON_KEY em falta — a usar placeholder (build/SSR). Configura .env.local ou o painel da Vercel.'
      )
    }
  }

  return createBrowserClient<Database>(url, key)
}
