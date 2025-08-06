import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

export async function GET() {
  try {
    // 1. Testar variáveis de ambiente
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        error: 'Variáveis de ambiente não configuradas',
        env: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      });
    }

    // 2. Testar conexão direta com Supabase
    const response = await fetch(supabaseUrl + '/rest/v1/appointments?select=count', {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro na conexão direta: ${error}`);
    }

    // 3. Testar cliente Supabase
    const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from('appointments')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Conexão testada com sucesso',
      directFetch: 'OK',
      clientFetch: 'OK',
      data
    });

  } catch (err) {
    console.error('Erro detalhado:', err);
    return NextResponse.json({
      error: 'Erro no teste de conexão',
      details: err instanceof Error ? err.message : 'Erro desconhecido',
    }, { status: 500 });
  }
}