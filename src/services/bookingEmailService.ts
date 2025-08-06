import emailjs from '@emailjs/browser';
import { emailjsConfig, initEmailJS } from '@/config/emailjs';
import { Service, services } from '@/config/services';

interface BookingEmailData {
  name: string;
  email: string;
  phone: string;
  serviceIds: string[];
  date: Date;
  time: string;
  notes?: string;
}

export async function sendBookingEmails(data: BookingEmailData) {
  // Inicializa o EmailJS
  if (!initEmailJS()) {
    console.error('❌ Falha na inicialização do EmailJS. Verificando variáveis de ambiente:', {
      publicKey: !!emailjsConfig.publicKey,
      serviceId: !!emailjsConfig.serviceId,
      userTemplateId: !!emailjsConfig.userTemplateId,
      adminTemplateId: !!emailjsConfig.adminTemplateId,
      adminEmail: !!emailjsConfig.adminEmail
    });
    throw new Error('Não foi possível inicializar o serviço de email. Verifique as variáveis de ambiente.');
  }

  // Busca os nomes dos serviços
  const selectedServices = services
    .filter(service => data.serviceIds.includes(service.id))
    .map(service => service.name);

  // Formata a data
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(data.date);

  // Template de dados para o cliente (usando as variáveis exatas do template HTML)
  const userTemplateData = {
    from_name: data.name,
    service: selectedServices.join(', '),
    date: formattedDate,
    time: data.time,
    address: "Bei der Grodener Kirche 7, 27472 Cuxhaven, Alemanha",
    address_link: "https://maps.app.goo.gl/Ld8tZSGZGbVFGwqr7"
  };

  // Template de dados para o admin (usando as variáveis exatas do template HTML)
  const adminTemplateData = {
    // Variáveis exatamente como aparecem no template HTML
    from_name: data.name,
    from_email: data.email,
    client_phone: data.phone,
    service: selectedServices.join(', '),
    date: formattedDate,
    time: data.time
  };

  try {
    // Envia email para o cliente
    const userEmailPromise = emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.userTemplateId,
      {
        ...userTemplateData,
        to_email: data.email
      }
    );

    // Envia email para o admin
    const adminEmailPromise = emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.adminTemplateId,
      {
        ...adminTemplateData,
        to_email: emailjsConfig.adminEmail
      }
    );

    // Aguarda o envio dos dois emails
    const [userResponse, adminResponse] = await Promise.all([
      userEmailPromise,
      adminEmailPromise
    ]);

    console.log('✅ Emails enviados com sucesso:', {
      userStatus: userResponse.status,
      adminStatus: adminResponse.status
    });

    return {
      success: true,
      userEmailStatus: userResponse.status,
      adminEmailStatus: adminResponse.status
    };

  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error);
    throw new Error('Não foi possível enviar os emails de confirmação');
  }
}