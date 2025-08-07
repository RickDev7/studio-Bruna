'use client'

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, AlertCircle, Phone } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';

function PagamentoContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const plano = searchParams.get('plano') || 'Plano não especificado';
  const valor = searchParams.get('valor') || '0';
  const tipo = searchParams.get('tipo') || 'sem_fidelidade';
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const dadosBancarios = [
    {
      id: 'banco',
      label: 'Banco',
      value: 'Sparkasse'
    },
    {
      id: 'titular',
      label: 'Titular',
      value: 'Bruna Silva'
    },
    {
      id: 'iban',
      label: 'IBAN',
      value: 'DE89 3705 0198 1932 1698 85'
    },
    {
      id: 'bic',
      label: 'BIC',
      value: 'COLSDE33'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB]/20 via-white to-[#FFE4E1]/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB]">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
              Finalizar Assinatura
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Por favor, utilize as informações bancárias abaixo para realizar sua transferência
            </p>

            {/* Resumo do Plano */}
            <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white mb-8">
              <h2 className="text-lg font-medium mb-2">Plano Selecionado</h2>
              <p className="text-2xl font-bold mb-2">{plano}</p>
              <p className="text-lg">{tipo === 'fidelidade' ? t('common.withLoyalty') : t('common.withoutLoyalty')}</p>
              <p className="text-3xl font-bold mt-4">{valor}{t('common.perMonth')}</p>
            </div>

            {/* Dados Bancários */}
            <div className="space-y-4">
              {dadosBancarios.map((dado) => (
                <div
                  key={dado.id}
                  className="bg-white p-4 rounded-xl border border-[#FFB6C1] flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-sm text-gray-500">{dado.label}</p>
                    <p className="text-lg font-medium text-gray-800">{dado.value}</p>
                  </div>
                  <button
                    onClick={() => handleCopy(dado.value, dado.id)}
                    className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                    aria-label={`Copiar ${dado.label}`}
                  >
                    {copiedField === dado.id ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <Copy className="w-5 h-5 text-[#FF69B4]" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Informações Importantes */}
            <div className="mt-8 bg-gradient-to-r from-[#FFE4E1] to-[#FFF0F5] p-6 rounded-xl border border-[#FFB6C1]">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-[#FF69B4] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Importante</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-3 marker:text-[#FF69B4]">
                    <li>Guarde o comprovante de transferência</li>
                    <li>O processamento pode levar até 2 dias úteis</li>
                    <li>Após confirmação do pagamento, entraremos em contato com você</li>
                    <li className="!mt-6 !list-none">
                      <div className="flex items-center bg-white p-4 rounded-lg border border-[#FFB6C1]">
                        <Phone className="w-5 h-5 text-[#FF69B4] mr-3" />
                        <span>
                          Envie o comprovante para nosso WhatsApp:{' '}
                          <a 
                            href="https://wa.me/4915208007814" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-[#FF69B4] hover:underline"
                          >
                            +49 152 080 07814
                          </a>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Botão Voltar */}
            <div className="mt-8">
              <Link
                href="/#planos"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-[#FF69B4] border-2 border-[#FFB6C1] hover:bg-[#FFB6C1] hover:text-white transition-all duration-300"
              >
                Voltar para os Planos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB]/20 via-white to-[#FFE4E1]/20">
      <Navbar />
      <Suspense>
        <PagamentoContent />
      </Suspense>
    </div>
  );
} 