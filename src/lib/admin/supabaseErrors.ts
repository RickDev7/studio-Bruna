/** PostgrestError não é `instanceof Error`; sem isto o toast/console mostram `{}`. */
export function formatSupabaseError(e: unknown): string {
  if (e instanceof Error && e.message) return e.message
  if (e !== null && typeof e === 'object') {
    const o = e as Record<string, unknown>
    const message = typeof o.message === 'string' ? o.message : ''
    const details = typeof o.details === 'string' ? o.details : ''
    const hint = typeof o.hint === 'string' ? o.hint : ''
    const code = typeof o.code === 'string' ? o.code : ''
    const text = [message, details, hint].filter(Boolean).join(' — ')
    if (text) return code ? `${text} (${code})` : text
    if (code) return `Erro na base de dados (${code}).`
  }
  try {
    const s = JSON.stringify(e)
    if (s && s !== '{}') return s
  } catch {
    /* ignore */
  }
  return 'Erro desconhecido ao falar com o Supabase.'
}
