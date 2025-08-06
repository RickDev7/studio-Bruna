import emailjs from '@emailjs/browser';

interface EmailJSConfig {
  publicKey: string;
  serviceId: string;
  userTemplateId: string;
  adminTemplateId: string;
  adminEmail: string;
}

// Função para obter e validar as variáveis de ambiente
const getEmailJSConfig = (): EmailJSConfig => {
  // Verifica se estamos no lado do cliente
  if (typeof window === 'undefined') {
    return {
      publicKey: '',
      serviceId: '',
      userTemplateId: '',
      adminTemplateId: '',
      adminEmail: '',
    };
  }

  const config = {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    userTemplateId: process.env.NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID || '',
    adminTemplateId: process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID || '',
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'bs.aestheticnails@gmail.com',
  };

  // Debug das variáveis de ambiente
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Verificando variáveis de ambiente do EmailJS:', {
      publicKey: config.publicKey ? '✅' : '❌',
      serviceId: config.serviceId ? '✅' : '❌',
      userTemplateId: config.userTemplateId ? '✅' : '❌',
      adminTemplateId: config.adminTemplateId ? '✅' : '❌',
      adminEmail: config.adminEmail ? '✅' : '❌',
    });
  }

  // Verifica se todas as variáveis necessárias estão presentes
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Variáveis de ambiente faltando:', missingVars.join(', '));
    console.info(`
      Para corrigir, adicione as seguintes variáveis ao arquivo .env.local:
      
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=seu_public_key
      NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id
      NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID=seu_template_id_usuario
      NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID=seu_template_id_admin
      NEXT_PUBLIC_ADMIN_EMAIL=seu_email_admin
    `);
  }

  return config;
};

// Configuração do EmailJS
export const emailjsConfig = getEmailJSConfig();

let isInitialized = false;

// Função para inicializar o EmailJS
export const initEmailJS = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (isInitialized) return true;

  try {
    // Verifica se todas as variáveis necessárias estão presentes
    if (!emailjsConfig.publicKey || 
        !emailjsConfig.serviceId || 
        !emailjsConfig.userTemplateId || 
        !emailjsConfig.adminTemplateId || 
        !emailjsConfig.adminEmail) {
      console.warn('⚠️ EmailJS não foi inicializado: configuração incompleta');
      return false;
    }

    emailjs.init({
      publicKey: emailjsConfig.publicKey,
      limitRate: {
        throttle: 2000,
      },
    });

    isInitialized = true;
    console.log('✅ EmailJS inicializado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro ao inicializar EmailJS:', error);
    return false;
  }
};

export default emailjsConfig; 