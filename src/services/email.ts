import { resend, resendConfig } from '@/config/resend';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  if (!resend) {
    console.warn('Serviço de email não configurado. Email não será enviado.');
    return { success: false, error: 'Serviço de email não configurado' };
  }

  try {
    const data = await resend.emails.send({
      from: resendConfig.fromEmail,
      to,
      subject,
      html,
    });

    return { success: true, data };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error };
  }
};

interface SendAppointmentConfirmationProps {
  userName: string;
  userEmail: string;
  service: string;
  date: string;
  time: string;
}

export async function sendAppointmentConfirmation({
  userName,
  userEmail,
  service,
  date,
  time,
}: SendAppointmentConfirmationProps) {
  if (!resend) {
    console.warn('Serviço de email não configurado. Email de confirmação não será enviado.');
    return { success: false, error: 'Serviço de email não configurado' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: resendConfig.fromEmail,
      to: userEmail,
      subject: 'Confirmação de Agendamento - Studio Bruna',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF69B4;">Confirmação de Agendamento</h2>
          <p>Olá ${userName},</p>
          <p>Seu agendamento foi confirmado com sucesso!</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #FF69B4; margin-top: 0;">Detalhes do Agendamento:</h3>
            <p><strong>Serviço:</strong> ${service}</p>
            <p><strong>Data:</strong> ${date}</p>
            <p><strong>Horário:</strong> ${time}</p>
          </div>
          
          <div style="margin-top: 20px;">
            <p><strong>Local:</strong> ${resendConfig.businessInfo.address}</p>
            <p>
              Em caso de dúvidas, entre em contato:
              <br>
              📞 ${resendConfig.businessInfo.phone}
              <br>
              ✉️ ${resendConfig.businessInfo.email}
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Atenciosamente,
              <br>
              Equipe ${resendConfig.businessInfo.name}
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro no serviço de email:', error);
    return { success: false, error };
  }
} 