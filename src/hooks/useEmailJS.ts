import { useEffect, useRef, useState } from 'react';
import { initEmailJS, emailjsConfig } from '@/config/emailjs';

export function useEmailJS() {
  const [isReady, setIsReady] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized.current) {
      return;
    }

    const init = async () => {
      try {
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

        const success = initEmailJS();
        initialized.current = true;

        if (success) {
          console.log('✅ EmailJS inicializado com sucesso');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar EmailJS:', error);
      }
    };

    init();
  }, []);

  return { isReady };
} 