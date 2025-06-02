import { useEffect, useRef, useState } from 'react';
import { initEmailJS, emailjsConfig } from '@/config/emailjs';

export function useEmailJS() {
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (initialized.current) return;

    // Verifica se todas as variáveis necessárias estão presentes
    const hasAllConfig = !!(
      emailjsConfig.publicKey &&
      emailjsConfig.serviceId &&
      emailjsConfig.userTemplateId &&
      emailjsConfig.adminTemplateId &&
      emailjsConfig.adminEmail
    );

    if (!hasAllConfig) {
      console.warn('⚠️ EmailJS: configuração incompleta');
      return;
    }

    // Tenta inicializar o EmailJS
    const success = initEmailJS();
    if (success) {
      initialized.current = true;
      setIsReady(true);
    }
  }, []);

  return { isReady };
} 