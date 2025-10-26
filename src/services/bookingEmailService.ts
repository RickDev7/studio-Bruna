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

  // Busca os nomes dos serviços e calcula o valor total
  const selectedServices = services
    .filter(service => data.serviceIds.includes(service.id))
    .map(service => service.name);

  // Valores não são calculados aqui pois não temos preços definidos
  // As informações de pagamento são fornecidas no template

  // Formata a data
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(data.date);

  // Template de dados para o cliente (usando as variáveis exatas do template HTML)
  const userTemplateData = {
    to_name: data.name,
    from_name: data.name,
    service: selectedServices.join(', '),
    service_name: selectedServices.join(', '),
    date: formattedDate,
    appointment_date: formattedDate,
    time: data.time,
    appointment_time: data.time,
    address: "Bei der Grodener Kirche 7, 27472 Cuxhaven, Alemanha",
    address_link: "https://maps.app.goo.gl/Ld8tZSGZGbVFGwqr7",
    payment_info: `Um Ihren Termin zu bestätigen, ist eine Anzahlung von 20% des Gesamtwerts der Dienstleistung erforderlich. Die Zahlung muss innerhalb von 48 Stunden nach dieser Buchung erfolgen. Für Termine mit weniger als 2 Tagen Vorlaufzeit muss die Zahlung am selben Tag erfolgen.`,
    payment_methods: "Sie können die Zahlung per Banküberweisung, PayPal oder bar im Studio vornehmen.",
    contact_whatsapp: "+49 152 800 7814",
    appointment_status: "confirmado",
    message: `Olá ${data.name}!

Seu agendamento foi recebido com sucesso!

📅 DETALHES DO AGENDAMENTO:
• Serviço: ${selectedServices.join(', ')}
• Data: ${formattedDate}
• Horário: ${data.time}
• Endereço: Bei der Grodener Kirche 7, 27472 Cuxhaven, Alemanha

💳 INFORMAÇÕES DE PAGAMENTO:
• Sinal de 20% do valor total dos serviços

Para confirmar seu agendamento, é necessário o pagamento de um sinal de 20% do valor total dos serviços. O pagamento deve ser feito até 48 horas após este agendamento. Para agendamentos com menos de 2 dias de antecedência, o pagamento deve ser feito no mesmo dia.

Você pode fazer o pagamento via transferência bancária, PayPal ou em dinheiro no estúdio.

⚠️ REGRAS IMPORTANTES:
• Em caso de atraso superior a 15 minutos, o atendimento poderá ser encurtado ou cancelado
• O sinal não é reembolsável se o cancelamento ocorrer com menos de 24h de antecedência
• Somente após o pagamento do sinal o horário será confirmado

📱 Para mais informações sobre o pagamento, entre em contato:
WhatsApp: +49 152 800 7814

Agradecemos pela confiança!
Bruna Silva Aesthetic & Nails 💅`
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