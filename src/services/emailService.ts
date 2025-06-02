import emailjs from '@emailjs/browser';

interface AppointmentEmailProps {
  userName: string;
  userEmail: string;
  service: string;
  date: string;
  time: string;
  status?: string;
}

const EMAIL_CONFIG = {
  serviceId: 'service_qe1ai6q',
  userTemplateId: 'template_gx390pv',
  adminTemplateId: 'template_amxl97d',
  publicKey: 'N1LpI9fHAIo0az4XG',
} as const;

// Inicializa o EmailJS
export const initEmailJS = () => {
  emailjs.init({
    publicKey: EMAIL_CONFIG.publicKey,
    limitRate: {
      throttle: 2000,
    },
  });
};

export const sendAppointmentEmail = async ({
  userName,
  userEmail,
  service,
  date,
  time,
  status = 'confirmado',
}: AppointmentEmailProps) => {
  try {
    console.log('📧 Enviando e-mails...');

    const userParams = {
      to_name: userName,
      to_email: userEmail,
      service_name: service,
      appointment_date: date,
      appointment_time: time,
      appointment_status: status,
    };

    const adminParams = {
      to_name: 'Bruna Silva',
      to_email: 'bs.aestheticnails@gmail.com',
      client_name: userName,
      client_email: userEmail,
      service_name: service,
      appointment_date: date,
      appointment_time: time,
      appointment_status: status,
    };

    // Envia e-mail para o usuário
    const userResponse = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.userTemplateId,
      userParams,
      EMAIL_CONFIG.publicKey
    );

    // Envia e-mail para o administrador
    const adminResponse = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.adminTemplateId,
      adminParams,
      EMAIL_CONFIG.publicKey
    );

    console.log('✅ E-mails enviados com sucesso!');
    return { success: true, data: { user: userResponse, admin: adminResponse } };
  } catch (error: any) {
    console.error('❌ Erro ao enviar e-mails:', error);
    return {
      success: false,
      error: error.message || 'Erro ao enviar e-mails de agendamento',
    };
  }
}; 