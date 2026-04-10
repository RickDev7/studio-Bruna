import { Buffer } from 'node:buffer'

/** Extrai o `ref` do JWT anon do Supabase (payload). */
export function parseSupabaseAnonJwtRef(anonKey: string): string | null {
  try {
    const parts = anonKey.trim().split('.')
    if (parts.length < 2) return null
    let payload = parts[1]
    const pad = payload.length % 4
    if (pad) payload += '='.repeat(4 - pad)
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = JSON.parse(Buffer.from(b64, 'base64').toString('utf8')) as {
      ref?: string
    }
    return typeof json.ref === 'string' ? json.ref : null
  } catch {
    return null
  }
}

/** Extrai o project ref do hostname `xxxx.supabase.co`. */
export function parseSupabaseUrlRef(supabaseUrl: string): string | null {
  try {
    const host = new URL(supabaseUrl).hostname
    if (!host.endsWith('.supabase.co')) return null
    return host.slice(0, -'.supabase.co'.length) || null
  } catch {
    return null
  }
}
