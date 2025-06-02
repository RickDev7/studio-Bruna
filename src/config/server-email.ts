import { EmailJSConfig } from './types';

// Função para validar uma variável de ambiente específica
const validateEnvVar = (key: string): string => {
  const value = process.env[key] || '';

  if (!value) {
    console.warn(`⚠️ Variável de ambiente ${key} não está configurada`);
    return '';
  }

  return value;
};

// Função para obter e validar as variáveis de ambiente do servidor
export const getServerEmailConfig = (): EmailJSConfig => {
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
    console.warn('⚠️ Variáveis de ambiente do servidor faltando:', missingVars.join(', '));
    console.info(`
      Para corrigir, adicione as seguintes variáveis ao arquivo .env:
      
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=seu_public_key
      NEXT_PUBLIC_EMAILJS_SERVICE_ID=seu_service_id
      NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID=seu_template_id
      NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID=seu_admin_template_id
      NEXT_PUBLIC_ADMIN_EMAIL=seu_email_admin
    `);
  }

  return config;
};

// Configuração do EmailJS para o servidor
export const serverEmailConfig = getServerEmailConfig();

export default serverEmailConfig; 