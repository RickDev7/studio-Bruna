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
  // Verifica as variáveis essenciais
  const essentialConfig = {
    publicKey: !!emailjsConfig.publicKey,
    serviceId: !!emailjsConfig.serviceId,
    userTemplateId: !!emailjsConfig.userTemplateId
  };

  const missingEssentials = Object.entries(essentialConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingEssentials.length > 0) {
    console.error('❌ Falha na inicialização do EmailJS:', {
      error: 'Variáveis essenciais faltando',
      missingVars: missingEssentials,
      config: essentialConfig
    });
    throw new Error(`Não foi possível inicializar o serviço de email. Variáveis essenciais faltando: ${missingEssentials.join(', ')}`);
  }

  // Inicializa o EmailJS apenas com as configurações essenciais
  if (!initEmailJS()) {
    throw new Error('Não foi possível inicializar o serviço de email');
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
    const userResponse = await emailjs.send(
      emailjsConfig.serviceId,
      emailjsConfig.userTemplateId,
      {
        ...userTemplateData,
        to_email: data.email
      }
    );

    console.log('✅ Email do cliente enviado com sucesso:', {
      userStatus: userResponse.status
    });

    // Tenta enviar email para o admin se as configurações estiverem presentes
    if (emailjsConfig.adminTemplateId && emailjsConfig.adminEmail) {
      try {
        const adminResponse = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.adminTemplateId,
          {
            ...adminTemplateData,
            to_email: emailjsConfig.adminEmail
          }
        );

        console.log('✅ Email do admin enviado com sucesso:', {
          adminStatus: adminResponse.status
        });

        return {
          success: true,
          userEmailStatus: userResponse.status,
          adminEmailStatus: adminResponse.status
        };
      } catch (adminError) {
        console.warn('⚠️ Não foi possível enviar o email para o admin:', adminError);
        // Continua mesmo se o email do admin falhar
        return {
          success: true,
          userEmailStatus: userResponse.status,
          adminEmailStatus: 'failed'
        };
      }
    } else {
      console.warn('⚠️ Email do admin não enviado: configuração incompleta');
      return {
        success: true,
        userEmailStatus: userResponse.status,
        adminEmailStatus: 'skipped'
      };
    }

  } catch (error) {
    console.error('❌ Erro ao enviar emails:', error);
    throw new Error('Não foi possível enviar os emails de confirmação');
  }
}