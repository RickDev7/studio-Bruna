import { resend, resendConfig } from '@/config/resend';
import { render } from '@react-email/render';
import BookingConfirmation from '@/components/emails/BookingConfirmation';
import AdminNotification from '@/components/emails/AdminNotification';

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

interface SendAppointmentConfirmationProps {
  userName: string;
  userEmail: string;
  service: string;
  date: string;
  time: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface SendAdminNotificationProps {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  message?: string;
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

export async function sendAppointmentConfirmation({
  userName,
  userEmail,
  service,
  date,
  time,
  status = 'pending',
}: SendAppointmentConfirmationProps) {
  if (!resend) {
    console.warn('Serviço de email não configurado. Email de confirmação não será enviado.');
    return { success: false, error: 'Serviço de email não configurado' };
  }

  try {
    const emailHtml = await render(
      BookingConfirmation({
        userName,
        service,
        date,
        time,
        status,
      })
    );

    const { data, error } = await resend.emails.send({
      from: resendConfig.fromEmail,
      to: userEmail,
      subject: `Agendamento ${status === 'confirmed' ? 'Confirmado' : status === 'cancelled' ? 'Cancelado' : 'Recebido'} - Studio Bruna`,
      html: emailHtml,
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

export async function sendAdminNotification({
  clientName,
  clientEmail,
  clientPhone,
  service,
  date,
  time,
  message,
}: SendAdminNotificationProps) {
  if (!resend) {
    console.warn('Serviço de email não configurado. Notificação não será enviada.');
    return { success: false, error: 'Serviço de email não configurado' };
  }

  try {
    const emailHtml = await render(
      AdminNotification({
        clientName,
        clientEmail,
        clientPhone,
        service,
        date,
        time,
        message,
      })
    );

    const { data, error } = await resend.emails.send({
      from: resendConfig.fromEmail,
      to: resendConfig.businessInfo.adminEmail,
      subject: '📬 Nova Solicitação de Agendamento - Studio Bruna',
      html: emailHtml,
    });

    if (error) {
      console.error('Erro ao enviar notificação:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Erro no serviço de email:', error);
    return { success: false, error };
  }
}

export default sendEmail; 