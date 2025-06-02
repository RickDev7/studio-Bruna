import emailjs from '@emailjs/browser';

interface EmailJSConfig {
  publicKey: string;
  serviceId: string;
  userTemplateId: string;
  adminTemplateId: string;
  adminEmail: string;
}

// Função para validar uma variável de ambiente específica
const validateEnvVar = (key: string): string => {
  // Verifica se estamos no lado do cliente
  if (typeof window === 'undefined') {
    return '';
  }

  // Acessa a variável de ambiente
  const value = process.env[key] || '';

  // Verifica se a variável existe e tem valor
  if (!value) {
    console.warn(`⚠️ Variável de ambiente ${key} não está configurada`);
    return '';
  }

  return value;
};

// Função para obter e validar as variáveis de ambiente
const getEmailJSConfig = (): EmailJSConfig => {
  // No lado do servidor, retornamos um objeto vazio
  if (typeof window === 'undefined') {
    return {
      publicKey: '',
      serviceId: '',
      userTemplateId: '',
      adminTemplateId: '',
      adminEmail: '',
    };
  }

  // Valores das variáveis de ambiente
  const config = {
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    userTemplateId: process.env.NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID || '',
    adminTemplateId: process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID || '',
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || '',
  };

  // Verifica se todas as variáveis necessárias estão presentes
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn('⚠️ Variáveis de ambiente faltando:', missingVars.join(', '));
    console.info(`
      Para corrigir, adicione as seguintes variáveis ao arquivo .env.local:
      
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=N1LpI9fHAIo0az4XG
      NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_qe1ai6q
      NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID=template_gx390pv
      NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID=template_amxl97d
      NEXT_PUBLIC_ADMIN_EMAIL=bs.aestheticnails@gmail.com
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