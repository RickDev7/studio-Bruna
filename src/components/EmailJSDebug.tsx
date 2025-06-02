'use client';

import { useEffect, useState } from 'react';
import { emailjsConfig } from '@/config/emailjs';
import { useEmailJSContext } from './EmailJSProvider';

interface ConfigStatus {
  name: string;
  envKey: string;
  value: string;
  isValid: boolean;
}

export function EmailJSDebug() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus[]>([]);
  const { isReady } = useEmailJSContext();

  useEffect(() => {
    const status: ConfigStatus[] = [
      {
        name: 'Chave Pública',
        envKey: 'NEXT_PUBLIC_EMAILJS_PUBLIC_KEY',
        value: emailjsConfig.publicKey ? '***' + emailjsConfig.publicKey.slice(-4) : '',
        isValid: !!emailjsConfig.publicKey
      },
      {
        name: 'ID do Serviço',
        envKey: 'NEXT_PUBLIC_EMAILJS_SERVICE_ID',
        value: emailjsConfig.serviceId,
        isValid: !!emailjsConfig.serviceId
      },
      {
        name: 'Template do Usuário',
        envKey: 'NEXT_PUBLIC_EMAILJS_USER_TEMPLATE_ID',
        value: emailjsConfig.userTemplateId,
        isValid: !!emailjsConfig.userTemplateId
      },
      {
        name: 'Template do Admin',
        envKey: 'NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID',
        value: emailjsConfig.adminTemplateId,
        isValid: !!emailjsConfig.adminTemplateId
      },
      {
        name: 'Email do Admin',
        envKey: 'NEXT_PUBLIC_ADMIN_EMAIL',
        value: emailjsConfig.adminEmail,
        isValid: !!emailjsConfig.adminEmail
      }
    ];

    setConfigStatus(status);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const allConfigured = configStatus.every(status => status.isValid);
  const missingCount = configStatus.filter(status => !status.isValid).length;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/80 text-white rounded-lg text-sm max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold">EmailJS Debug</h3>
        <div className="flex gap-2">
          <span className={`text-xs px-2 py-1 rounded ${allConfigured ? 'bg-green-500' : 'bg-red-500'}`}>
            {allConfigured ? '✅ Config OK' : `❌ ${missingCount} pendente${missingCount > 1 ? 's' : ''}`}
          </span>
          <span className={`text-xs px-2 py-1 rounded ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`}>
            {isReady ? '✅ Inicializado' : '⚠️ Aguardando'}
          </span>
        </div>
      </div>

      {!allConfigured && (
        <div className="mb-3 p-2 bg-yellow-500/20 rounded text-yellow-200 text-xs">
          <p className="font-medium mb-1">⚠️ Configuração Incompleta</p>
          <ol className="list-decimal list-inside space-y-1 opacity-80">
            <li>Verifique o arquivo .env.local</li>
            <li>Adicione as variáveis faltantes</li>
            <li>Reinicie o servidor Next.js</li>
          </ol>
        </div>
      )}

      <ul className="space-y-2 divide-y divide-white/10">
        {configStatus.map((status) => (
          <li key={status.envKey} className="pt-2 first:pt-0">
            <div className="flex items-center gap-2">
              <span className={status.isValid ? 'text-green-500' : 'text-red-500'}>
                {status.isValid ? '✅' : '❌'}
              </span>
              <span className="font-medium">{status.name}</span>
            </div>
            <div className="mt-1 text-xs opacity-75">
              <code className="bg-black/50 px-1 py-0.5 rounded">
                {status.envKey}
              </code>
              {status.isValid ? (
                <span className="ml-2 text-green-400">{status.value || '[vazio]'}</span>
              ) : (
                <span className="ml-2 text-red-400">não configurado</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 