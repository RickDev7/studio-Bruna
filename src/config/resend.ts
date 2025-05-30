import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY não está configurada nas variáveis de ambiente. O envio de emails estará desativado.');
}

export const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export const resendConfig = {
  fromEmail: 'bs.aestheticnails@resend.dev', // Você precisará verificar este domínio no Resend
  businessInfo: {
    name: 'Bruna Silva - Aesthetic & Nails',
    address: 'Cuxhaven, Germany',
    phone: '+49 123456789',
    email: 'bs.aestheticnails@gmail.com',
    adminEmail: 'ricksilva.dev7@gmail.com'
  },
  templates: {
    confirmation: 'confirmation',
    reminder: 'reminder',
    cancellation: 'cancellation',
    reschedule: 'reschedule'
  }
}; 