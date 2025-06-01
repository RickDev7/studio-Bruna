import { Resend } from 'resend';

// Chave hardcoded temporariamente para teste
const RESEND_API_KEY = 're_Lj7VWUHK_DMe2CsVE4hw52DwHeVxEfWrZ';

console.log('Verificando configuração do Resend:');
console.log('RESEND_API_KEY está definida?', !!RESEND_API_KEY);

if (!RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY não está configurada nas variáveis de ambiente. O envio de emails estará desativado.');
}

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const resendConfig = {
  // Durante os testes, use o email verificado
  fromEmail: 'onboarding@resend.dev', // Email padrão do Resend para testes
  businessInfo: {
    name: 'BS Aesthetic & Nails',
    address: 'Bei der Grodener Kirche 7',
    phone: '+49 1520 8007814',
    email: 'dev_henrique@outlook.com', // Email que receberá as notificações durante os testes
    instagram: '@bs.aesthetic.nails',
    adminEmail: 'dev_henrique@outlook.com', // Email que receberá as notificações durante os testes
    whatsapp: '+49 1520 8007814',
  },
  templates: {
    booking: {
      confirmation: 'Confirmação de Agendamento',
      pending: 'Solicitação de Agendamento Recebida',
      cancelled: 'Agendamento Cancelado',
    },
    admin: {
      newBooking: 'Nova Solicitação de Agendamento',
    },
  },
}; 