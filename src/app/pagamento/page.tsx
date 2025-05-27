'use client'

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PagamentoPage() {
  const searchParams = useSearchParams();
  const valor = searchParams.get('valor');
  const plano = searchParams.get('plano');

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Informações de Pagamento</h1>
            <p className="text-gray-600">Por favor, utilize as informações bancárias abaixo para realizar sua transferência</p>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados Bancários</h2>
              
            <div className="space-y-4">
              {valor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Valor a Pagar</label>
                  <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-800 font-semibold">{valor}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-800">BRUNA RAFAELA PEREIRA DA SILVA</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">IBAN</label>
                <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-mono">DE13 1001 1001 2518 5510 36</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">BIC/SWIFT</label>
                <div className="mt-1 p-3 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-800 font-mono">NTSBDEB1XXX</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mt-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Importante</h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-2">
                <li>Guarde o comprovante de transferência</li>
                <li>O processamento pode levar até 2 dias úteis</li>
                <li>Após confirmação do pagamento, você receberá um e-mail</li>
              </ul>
            </div>

            <div className="text-center pt-6">
              <Link 
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
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