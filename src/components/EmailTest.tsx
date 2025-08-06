'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '@/config/emailjs';

export function EmailTest() {
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<string>('');
  const isReady = true; // Assuming EmailJS is always ready for development

  const handleTestEmail = async () => {
    if (!isReady) {
      setResult('❌ EmailJS ainda não está pronto. Aguarde a inicialização.');
      return;
    }

    setIsSending(true);
    setResult('');

    try {
      const response = await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.userTemplateId,
        {
          to_name: 'Teste',
          to_email: emailjsConfig.adminEmail,
          subject: 'Teste de Email',
          message: 'Este é um email de teste do sistema.',
        },
        emailjsConfig.publicKey
      );

      setResult(`✅ Email enviado com sucesso! (Status: ${response.status}, ID: ${response.text})`);
    } catch (error: any) {
      console.error('Erro ao enviar email de teste:', error);
      setResult(`❌ Erro ao enviar email: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsSending(false);
    }
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 p-4 bg-black/80 text-white rounded-lg text-sm">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-bold">Teste de Email</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${isReady ? 'bg-green-500' : 'bg-yellow-500'}`}>
          {isReady ? '✅ Pronto' : '⚠️ Inicializando'}
        </span>
      </div>
      
      <button
        onClick={handleTestEmail}
        disabled={isSending || !isReady}
        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed w-full mb-2"
      >
        {isSending ? 'Enviando...' : 'Enviar Email de Teste'}
      </button>

      {result && (
        <div className={`mt-2 text-xs p-2 rounded ${result.includes('✅') ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          {result}
        </div>
      )}
    </div>
  );
} 