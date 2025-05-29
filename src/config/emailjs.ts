// Tipos para as configurações do EmailJS
interface EmailJSConfig {
  serviceId: string;
  templates: {
    clientConfirmation: string;
    adminNotification: string;
  };
  publicKey: string;
  adminEmail: string;
  businessInfo: {
    name: string;
    address: string;
    phone: string;
  };
}

// Configuração do EmailJS
export const emailjsConfig: EmailJSConfig = {
  // Service ID do seu serviço de email (Gmail, etc)
  serviceId: 'service_fvd89oq',

  // IDs dos templates de email
  templates: {
    // Template para email de confirmação enviado ao cliente
    clientConfirmation: 'template_j4rdnu5',
    // Template para notificação enviada ao administrador
    adminNotification: 'template_ynhvu4y'
  },

  // Sua chave pública do EmailJS (encontrada em Account > API Keys)
  publicKey: 'pELxsCwl_sYWMQ5Ds',

  // Email do administrador para receber notificações
  adminEmail: 'bs.aestheticnails@gmail.com',

  // Informações do negócio
  businessInfo: {
    name: 'Bruna Silva - Aesthetic & Nails',
    address: 'Deichstraße 37, 27472 Cuxhaven, Deutschland',
    phone: '+49 176 24290357'
  }
}; 