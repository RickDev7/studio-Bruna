import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

// Cliente Supabase com configuração otimizada
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    storage: undefined
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    },
    fetch: async (url, options: RequestInit = {}) => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout

      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          keepalive: true,
          cache: 'no-store',
          headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response
      } catch (error) {
        console.error('[Supabase] Erro na requisição:', error)
        throw error
      } finally {
        clearTimeout(timeoutId)
      }
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

export async function GET(req: Request) {
  try {
    console.log('[API] ➤ Recebendo requisição GET /api/appointments')

    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    console.log('[API] ➤ Parâmetros recebidos:', { startDate, endDate })

    if (!startDate || !endDate) {
      return NextResponse.json({
        error: 'Parâmetros inválidos',
        details: 'startDate e endDate são obrigatórios',
        params: { startDate, endDate }
      }, { status: 400 })
    }

    const startDateTime = new Date(startDate)
    const endDateTime = new Date(endDate)

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      return NextResponse.json({
        error: 'Formato de data inválido',
        details: 'As datas devem estar no formato ISO 8601',
        params: { startDate, endDate }
      }, { status: 400 })
    }

    console.log('[API] ➤ Consultando Supabase com:', {
      scheduled_at: { gte: startDate, lt: endDate },
      status: ['confirmed', 'rescheduled']
    })

    // Tentativa de consulta com retry automático
    const { data, error } = await supabase
      .from('appointments')
      .select('scheduled_at, status')
      .gte('scheduled_at', startDate)
      .lt('scheduled_at', endDate)
      .or('status.eq.confirmed,status.eq.rescheduled')

    if (error) {
      console.error('[API] ❌ Erro Supabase:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Tratamento específico para erros comuns
      if (error.message?.includes('fetch failed') || 
          error.message?.includes('network') ||
          error.message?.includes('AbortError') ||
          error.message?.includes('timeout') ||
          error.message?.includes('Failed to fetch') ||
          error.message?.includes('NetworkError')) {
        
        console.log('[API] ⚠️ Erro de conexão detectado, retornando 503')
        
        return NextResponse.json({
          error: 'Erro de conexão',
          details: 'Não foi possível conectar ao banco de dados',
          message: 'Verifique sua conexão e tente novamente em alguns instantes',
          retry: true,
          attempt: 1
        }, { 
          status: 503,
          headers: {
            'Retry-After': '3',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Connection': 'keep-alive'
          }
        })
      }

      if (error.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Erro de configuração',
          details: 'Estrutura do banco de dados não está correta',
          message: error.message
        }, { 
          status: 500,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate'
          }
        })
      }

      return NextResponse.json({
        error: 'Erro ao consultar agendamentos',
        details: error.message,
        hint: error.hint,
        code: error.code
      }, { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      })
    }

    const appointments = data?.map(a => ({
      scheduled_at: a.scheduled_at,
      status: a.status
    })) ?? []

    console.log('[API] ✅ Agendamentos encontrados:', appointments.length)

    return NextResponse.json({
      data: appointments,
      count: appointments.length,
      range: { start: startDate, end: endDate }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Type': 'application/json'
      }
    })

  } catch (err) {
    console.error('[API] ❗ Erro não tratado:', err)

    // Se for erro de rede, retornar 503
    if (err instanceof Error && 
       (err.message.includes('fetch failed') || 
        err.message.includes('network') || 
        err.message.includes('Máximo de tentativas excedido'))) {
      return NextResponse.json({
        error: 'Serviço temporariamente indisponível',
        details: 'Não foi possível conectar ao banco de dados',
        message: 'Por favor, tente novamente em alguns instantes',
        retry: true
      }, { status: 503 })
    }

    return NextResponse.json({
      error: 'Erro interno do servidor',
      message: err instanceof Error ? err.message : String(err),
      ...(process.env.NODE_ENV === 'development' && {
        stack: err instanceof Error ? err.stack : undefined
      })
    }, { status: 500 })
  }
}