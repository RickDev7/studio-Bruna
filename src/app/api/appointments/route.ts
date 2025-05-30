import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    console.log('Dados recebidos:', body);

    // Verificar se o usuário está autenticado
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log('Usuário não autenticado');
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    console.log('Usuário autenticado:', user.id);

    // Validar dados necessários
    if (!body.service || !body.date || !body.time) {
      console.log('Dados inválidos:', { service: body.service, date: body.date, time: body.time });
      return NextResponse.json(
        { error: 'Dados inválidos. Serviço, data e hora são obrigatórios.' },
        { status: 400 }
      );
    }

    // Formatar a data e hora
    try {
      const [hours, minutes] = body.time.split(':');
      const scheduledDate = new Date(body.date);
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      console.log('Data formatada:', scheduledDate.toISOString());

      // Criar o agendamento
      try {
        const { data: appointment, error: insertError } = await supabase
          .from('appointments')
          .insert({
            user_id: user.id,
            profile_id: user.id,
            service: body.service,
            scheduled_at: scheduledDate.toISOString(),
            status: 'pending',
            notes: body.notes || null
          })
          .select()
          .single();

        if (insertError) {
          console.error('Erro detalhado do Supabase:', {
            code: insertError.code,
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint
          });
          
          // Verificar se é um erro de permissão
          if (insertError.code === 'PGRST301' || insertError.message?.includes('permission denied')) {
            return NextResponse.json(
              { error: 'Sem permissão para criar agendamento. Por favor, verifique suas permissões.' },
              { status: 403 }
            );
          }

          return NextResponse.json(
            { error: insertError.message || 'Erro ao criar agendamento no banco de dados' },
            { status: 500 }
          );
        }

        console.log('Agendamento criado com sucesso:', appointment);
        return NextResponse.json({ 
          message: 'Agendamento criado com sucesso!',
          appointment: appointment
        });
      } catch (supabaseError) {
        console.error('Erro ao executar query no Supabase:', supabaseError);
        return NextResponse.json(
          { error: 'Erro interno ao criar agendamento' },
          { status: 500 }
        );
      }
    } catch (dateError) {
      console.error('Erro ao formatar data:', dateError);
      return NextResponse.json(
        { error: 'Data ou hora inválida' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Erro geral:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 