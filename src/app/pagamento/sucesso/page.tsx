'use client'

import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function SucessoPage() {
  const searchParams = useSearchParams();
  const plano = searchParams.get('plano');
  const valor = searchParams.get('valor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB] text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB6C1] to-[#FFE4E1] mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#FF69B4]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
              Obrigado por escolher a Bruna Silva - Aesthetic & Nails
            </h1>
            <p className="text-gray-600 text-lg mb-6">
              Obrigado por escolher o Studio Bruna
            </p>
          </div>

          {plano && valor && (
            <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white mb-8">
              <h2 className="text-lg font-medium mb-2">Detalhes da Assinatura</h2>
              <p className="text-2xl font-bold mb-2">{plano}</p>
              <p className="text-3xl font-bold">{valor}/mês</p>
            </div>
          )}

          <div className="bg-[#FFF0F5] p-6 rounded-xl border border-[#FFB6C1] mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Próximos Passos</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#FF69B4] text-white text-sm mr-3 mt-0.5">
                  1
                </span>
                <p className="text-gray-700">
                  Após confirmação do pagamento, entraremos em contato com você
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#FF69B4] text-white text-sm mr-3 mt-0.5">
                  2
                </span>
                <p className="text-gray-700">
                  Nossa equipe entrará em contato para agendar seu primeiro atendimento
                </p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-[#FF69B4] text-white text-sm mr-3 mt-0.5">
                  3
                </span>
                <p className="text-gray-700">
                  Você terá acesso a todos os benefícios do seu plano imediatamente após a confirmação do pagamento
                </p>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-3 px-4 rounded-full font-medium text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:opacity-90 transition-all duration-300 text-center"
            >
              Voltar para a Página Inicial
            </Link>
            <a
              href="https://wa.me/491637647843"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-full font-medium text-[#FF69B4] border-2 border-[#FFB6C1] hover:bg-[#FFB6C1] hover:text-white transition-all duration-300 text-center"
            >
              Falar com o Studio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 