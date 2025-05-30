import { NextResponse } from 'next/server';
import { sendAppointmentConfirmation } from '@/services/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userName,
      userEmail,
      service,
      date,
      time,
      isAppointmentConfirmation
    } = body;

    if (isAppointmentConfirmation) {
      const result = await sendAppointmentConfirmation({
        userName,
        userEmail,
        service,
        date,
        time
      });

      if (!result.success) {
        // Se o serviço de email não estiver configurado, retornamos sucesso
        // mas com um aviso de que o email não foi enviado
        if (result.error === 'Serviço de email não configurado') {
          return NextResponse.json({
            success: true,
            warning: 'Email não enviado: serviço não configurado'
          });
        }

        // Para outros erros, retornamos erro 500
        return NextResponse.json(
          { error: result.error || 'Erro ao enviar email' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 