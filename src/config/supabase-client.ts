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

/**
 * Projeto antigo referenciado no histórico do repo — o host deixa de resolver
 * (projeto apagado/pausado). Se a env ainda apontar aqui, o login dá ERR_NAME_NOT_RESOLVED.
 */
export const LEGACY_UNREACHABLE_SUPABASE_PROJECT_REF = 'ddpfougnudxkirmzzsub'

/** A URL pública configurada aponta para o projeto legado que já não existe no DNS. */
export function isUnreachableLegacySupabaseUrl(): boolean {
  const u = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
  return u.includes(LEGACY_UNREACHABLE_SUPABASE_PROJECT_REF)
}

/** Indica se as variáveis públicas do Supabase estão definidas (cliente usa o teu projeto). */
export function isSupabaseEnvConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  )
}

export type CreateBrowserClientOptions = {
  /**
   * `false` força nova instância e volta a ler a URL (PKCE / recovery) — evita
   * singleton antigo de outra página. Usar em /reset-password quando há `?code=`.
   */
  singleton?: boolean
}

/**
 * Origem pública da app (deve coincidir com Site URL / Redirect URLs no Supabase).
 * Se `NEXT_PUBLIC_SITE_URL` existir, tem prioridade sobre `window` — evita email com :3001
 * e redirect só autorizado para :3000 (ou o contrário).
 */
export function getPublicSiteOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '')
  if (fromEnv) return fromEnv
  if (typeof window !== 'undefined') return window.location.origin
  return ''
}

/** URL absoluta do handler PKCE (definir redirects Supabase / OAuth / email para aqui). */
export function getAuthCallbackUrl(nextPath: string): string {
  const path = nextPath.startsWith('/') ? nextPath : `/${nextPath}`
  const origin = getPublicSiteOrigin()
  if (!origin) {
    return `/auth/callback?next=${encodeURIComponent(path)}`
  }
  return `${origin}/auth/callback?next=${encodeURIComponent(path)}`
}

/**
 * Cliente browser alinhado com o servidor (@supabase/ssr).
 * Não uses get/set manuais em document.cookie — partiam valores com '=' (JWT)
 * e a sessão não chegava ao layout/API no Next.
 */
export function createClient(options?: CreateBrowserClientOptions) {
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

  const singleton = options?.singleton ?? true
  // Em HTTPS (Vercel/produção), cookies sem `secure` podem ser ignorados por alguns browsers.
  const cookieOptions =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? { secure: true as const }
      : {}

  // @supabase/ssr: se passares um 3.º argumento sem `cookies`, o destructuring
  // deixa `cookies` como undefined e getItem rebenta ao aceder a cookies.get.
  return createBrowserClient<Database>(url, key, {
    isSingleton: singleton,
    cookies: {},
    cookieOptions,
  })
}
