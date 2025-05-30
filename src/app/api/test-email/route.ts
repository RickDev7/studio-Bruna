import { NextResponse } from 'next/server';
import { sendAppointmentConfirmation } from '@/services/email';

export async function GET() {
  try {
    await sendAppointmentConfirmation({
      userName: 'Usuário Teste',
      userEmail: 'bs.aestheticnails@gmail.com', // Email do studio para teste
      service: 'Manicure',
      date: '30/05/2024',
      time: '09:00'
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro no teste de email:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar email de teste' },
      { status: 500 }
    );
  }
} 