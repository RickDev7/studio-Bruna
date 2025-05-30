import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Chamar a função RPC create_appointment
    const { data, error } = await supabase.rpc('create_appointment', {
      p_service: body.service,
      p_date: body.date,
      p_time: body.time,
      p_user_id: user.id,
      p_status: 'confirmed',
      p_notes: body.notes
    });

    if (error) {
      console.error('Erro ao criar agendamento:', error);
      return NextResponse.json(
        { error: error.message || 'Erro ao criar agendamento' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 