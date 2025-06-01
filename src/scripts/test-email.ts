import { sendAppointmentConfirmation } from '@/services/email';

async function testEmail() {
  try {
    console.log('Iniciando teste de envio de email...');
    
    const result = await sendAppointmentConfirmation({
      userName: 'Cliente Teste',
      userEmail: 'bs.aestheticnails@gmail.com', // Email que receberá a confirmação
      service: 'Manicure',
      date: '30/05/2024',
      time: '09:00',
      status: 'pending' // pode ser 'pending', 'confirmed' ou 'cancelled'
    });

    if (result.success) {
      console.log('✅ Email enviado com sucesso!');
      console.log('Detalhes:', result.data);
    } else {
      console.error('❌ Erro ao enviar email:', result.error);
    }
  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

testEmail(); 