'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, AlertCircle, Phone } from 'lucide-react';

export default function PagamentoPage() {
  const searchParams = useSearchParams();
  const valor = searchParams.get('valor');
  const plano = searchParams.get('plano');

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
      label: 'Banco',
      value: 'N26 Bank',
      id: 'banco'
    },
    {
      label: 'Nome',
      value: 'BRUNA RAFAELA PEREIRA DA SILVA',
      id: 'nome'
    },
    {
      label: 'IBAN',
      value: 'DE13 1001 1001 2518 5510 36',
      id: 'iban'
    },
    {
      label: 'BIC/SWIFT',
      value: 'NTSBDEB1XXX',
      id: 'bic'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB]">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
              Informações de Pagamento
            </h1>
            <p className="text-gray-600 text-lg">
              Por favor, utilize as informações bancárias abaixo para realizar sua transferência
            </p>
          </div>

          <div className="space-y-8">
            {valor && (
              <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white text-center mb-8 transform hover:scale-105 transition-transform duration-300 shadow-lg">
                <h2 className="text-lg font-medium mb-2">Valor a Pagar</h2>
                <p className="text-3xl font-bold">{valor}</p>
              </div>
            )}

            <div className="space-y-6">
              {dadosBancarios.map(({ label, value, id }) => (
                <div
                  key={id}
                  className="group relative bg-white rounded-xl border border-[#FFB6C1] p-4 transition-all duration-300 hover:shadow-md hover:border-[#FF69B4]"
                >
                  <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-800 font-medium">{value}</p>
                    <button
                      onClick={() => handleCopy(value, id)}
                      className="ml-2 p-2 text-gray-500 hover:text-[#FF69B4] rounded-lg transition-colors duration-200 hover:bg-pink-50"
                      title="Copiar"
                    >
                      {copiedField === id ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#FFE4E1] to-[#FFF0F5] p-6 rounded-xl border border-[#FFB6C1] mt-8">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-[#FF69B4] mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Importante</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-3 marker:text-[#FF69B4]">
                    <li>Guarde o comprovante de transferência</li>
                    <li>O processamento pode levar até 2 dias úteis</li>
                    <li>Após confirmação do pagamento, você receberá um e-mail</li>
                    {plano && <li>Este pagamento é referente ao {plano}</li>}
                    <li className="!mt-6 !list-none">
                      <div className="flex items-center bg-white p-4 rounded-lg border border-[#FFB6C1]">
                        <Phone className="w-5 h-5 text-[#FF69B4] mr-3" />
                        <span>
                          Envie o comprovante para nosso WhatsApp:{' '}
                          <a 
                            href="https://wa.me/491637647843" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-[#FF69B4] hover:underline"
                          >
                            +49 163 764 7843
                          </a>
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
              >
                Voltar para a Página Inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 