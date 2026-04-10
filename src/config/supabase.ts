/**
 * Instância única no browser (mesmo GoTrue que login/admin via @supabase/ssr).
 * Evita "Multiple GoTrueClient instances" ao misturar com createClient(supabase-js) puro.
 */
import { createClient } from '@/config/supabase-client'

export const supabase = createClient()
