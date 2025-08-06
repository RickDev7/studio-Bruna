import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Variáveis de ambiente não configuradas',
        env: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      }, { status: 500 })
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    // Tenta fazer uma consulta simples
    const { data, error } = await supabase
      .from('appointments')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json({
        error: 'Erro ao conectar com Supabase',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase estabelecida com sucesso',
      data
    })

  } catch (err) {
    console.error('Erro ao testar conexão:', err)
    return NextResponse.json({
      error: 'Erro interno ao testar conexão',
      details: err instanceof Error ? err.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}