import { NextResponse } from 'next/server';
import { sendAppointmentConfirmation, sendAdminNotification } from '@/services/email';

export async function GET() {
  try {
    // Teste do email de confirmação para o cliente
    const clientResult = await sendAppointmentConfirmation({
      userName: 'Cliente Teste',
      userEmail: 'dev_henrique@outlook.com',
      service: 'Manicure',
      date: '30/05/2024',
      time: '09:00',
      status: 'pending'
    });

    // Teste do email de notificação para o administrador
    const adminResult = await sendAdminNotification({
      clientName: 'Cliente Teste',
      clientEmail: 'dev_henrique@outlook.com',
      clientPhone: '+49 1520 8007814',
      service: 'Manicure',
      date: '30/05/2024',
      time: '09:00',
      message: 'Mensagem de teste para verificar o sistema de notificações.'
    });

    return NextResponse.json({ 
      success: true,
      clientEmail: clientResult,
      adminEmail: adminResult
    });
  } catch (error: any) {
    console.error('Erro no teste de email:', error);
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar email de teste' },
      { status: 500 }
    );
  }
} 