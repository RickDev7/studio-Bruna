import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Função para fazer fetch com retry e timeout
const customFetch = async (url: RequestInfo | URL, init?: RequestInit) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        ...init?.headers,
        'Content-Type': 'application/json',
      },
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout ao tentar conectar com Supabase')
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

// Configuração do cliente Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    storage: undefined,
  },
  global: {
    fetch: customFetch,
  },
})