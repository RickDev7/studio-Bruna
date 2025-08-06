import nodemailer from 'nodemailer';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface SendEmailResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface SendAppointmentConfirmationProps {
  userName: string;
  userEmail: string;
  service: string;
  date: string;
  time: string;
  status?: string;
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

// Configuração do transportador de email
const createTransporter = () => {
  // Validar variáveis de ambiente
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Credenciais de email não configuradas. Verifique as variáveis EMAIL_USER e EMAIL_PASS.');
  }

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Senha de app do Gmail
    },
  });
};

// Função auxiliar para formatar data e hora
const formatDateTime = (date: string, time: string) => {
  try {
    let dateObj: Date;
    
    // Verifica se a data está no formato DD/MM/YYYY
    if (date.includes('/')) {
      dateObj = parse(date + ' ' + time, 'dd/MM/yyyy HH:mm', new Date());
    } else {
      // Assume formato YYYY-MM-DD
      const [year, month, day] = date.split('-').map(Number);
      const [hours, minutes] = time.split(':').map(Number);
      dateObj = new Date(year, month - 1, day, hours, minutes);
    }

    const formattedDate = format(dateObj, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    const formattedTime = format(dateObj, 'HH:mm');

    return {
      formattedDate,
      formattedTime,
    };
  } catch (error) {
    console.error('Erro ao formatar data e hora:', error);
    return {
      formattedDate: date,
      formattedTime: time,
    };
  }
};

// Função base para enviar emails
const sendEmail = async ({ to, subject, text, html }: SendEmailProps): Promise<SendEmailResult> => {
  try {
    console.log('📧 Preparando para enviar email para:', to);
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    console.log('📧 Enviando email com as opções:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso:', info.messageId);

    return { success: true, data: info };
  } catch (error: any) {
    console.error('❌ Erro ao enviar email:', {
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message || 'Erro ao enviar email' };
  }
};

// Função para enviar email de confirmação de agendamento
export async function sendAppointmentConfirmation({
  userName,
  userEmail,
  service,
  date,
  time,
  status = 'confirmado',
}: SendAppointmentConfirmationProps): Promise<SendEmailResult> {
  try {
    const { formattedDate, formattedTime } = formatDateTime(date, time);

    // Email para o cliente
    const clientSubject = 'Confirmação de Agendamento - Bruna Silva - Aesthetic & Nails';
    const clientText = `
Olá ${userName},

Seu agendamento foi ${status} com sucesso!

Detalhes do agendamento:
- Serviço: ${service}
- Data: ${formattedDate}
- Horário: ${formattedTime}
- Status: ${status}

Endereço:
Rua Exemplo, 123
Bairro Exemplo
São Paulo - SP

Observações importantes:
- Chegue com 5 minutos de antecedência
- Em caso de impossibilidade de comparecimento, avise com 24h de antecedência
- Traga sua máscara

Qualquer dúvida, entre em contato conosco.

Atenciosamente,
Bruna Silva - Aesthetic & Nails
    `.trim();

    const clientResult = await sendEmail({
      to: userEmail,
      subject: clientSubject,
      text: clientText,
    });

    // Se configurado, envia notificação para o admin
    let adminResult: SendEmailResult = { success: true };
    if (process.env.ADMIN_EMAIL) {
      const adminSubject = 'Novo Agendamento Recebido';
      const adminText = `
Novo agendamento recebido:

Cliente: ${userName}
Email: ${userEmail}
Serviço: ${service}
Data: ${formattedDate}
Horário: ${formattedTime}
Status: ${status}
      `.trim();

      adminResult = await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: adminText,
      });
    }

    return {
      success: clientResult.success && adminResult.success,
      data: {
        clientEmail: clientResult.data,
        adminEmail: adminResult.data,
      },
      error: clientResult.error || adminResult.error,
    };
  } catch (error: any) {
    console.error('❌ Erro ao enviar email de confirmação:', error);
    return { success: false, error: error.message || 'Erro ao enviar email de confirmação' };
  }
}

// Função para enviar notificação administrativa
export async function sendAdminNotification({
  clientName,
  clientEmail,
  clientPhone,
  service,
  date,
  time,
  message,
}: SendAdminNotificationProps): Promise<SendEmailResult> {
  try {
    if (!process.env.ADMIN_EMAIL) {
      throw new Error('Email do administrador não configurado');
    }

    const { formattedDate, formattedTime } = formatDateTime(date, time);

    const subject = 'Nova Notificação de Agendamento';
    const text = `
Nova notificação de agendamento:

Cliente: ${clientName}
Email: ${clientEmail}
Telefone: ${clientPhone}
Serviço: ${service}
Data: ${formattedDate}
Horário: ${formattedTime}
${message ? `\nMensagem do cliente:\n${message}` : ''}
    `.trim();

    return await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
    });
  } catch (error: any) {
    console.error('❌ Erro ao enviar notificação administrativa:', error);
    return { success: false, error: error.message || 'Erro ao enviar notificação administrativa' };
  }
}

export default sendEmail; 

// Serviço de email temporário
export async function sendAppointmentConfirmationEmail(
  appointmentData: any
): Promise<{ success: boolean; error?: string }> {
  console.log('Email de confirmação seria enviado com os dados:', appointmentData);
  return { success: true };
}

export async function sendAppointmentReminderEmail(
  appointmentData: any
): Promise<{ success: boolean; error?: string }> {
  console.log('Email de lembrete seria enviado com os dados:', appointmentData);
  return { success: true };
}

export async function sendContactFormEmail(
  formData: any
): Promise<{ success: boolean; error?: string }> {
  console.log('Email do formulário de contato seria enviado com os dados:', formData);
  return { success: true };
} 