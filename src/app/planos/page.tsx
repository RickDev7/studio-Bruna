import React from 'react';
import Link from 'next/link';
import { Contract } from '@/components/Contract';

export default function PlanosPage() {
  const planos = [
    {
      id: 'basico',
      nome: "Plano Básico",
      preco: "40€",
      periodo: "/mês",
      beneficios: [
        "1 Manicure com Shellac",
        "1 Pedicure simples",
        "10% de desconto em serviços adicionais"
      ],
      destaque: false
    },
    {
      id: 'balance',
      nome: "Plano Balance",
      preco: "65€",
      periodo: "/mês",
      beneficios: [
        "1 Tratamento de unhas em gel",
        "1 Pedicure com Shellac",
        "1 Design de sobrancelhas",
        "Até 2 reparos de unhas",
        "10% de desconto em serviços adicionais",
        "Prioridade no agendamento"
      ],
      destaque: true
    },
    {
      id: 'premium',
      nome: "Plano Premium",
      preco: "115€",
      periodo: "/mês",
      beneficios: [
        "1 Spa pedicure com Shellac",
        "1 Tratamento de unhas em gel",
        "1 Limpeza facial",
        "1 Design de sobrancelhas",
        "Reparos ilimitados de unhas",
        "15% de desconto em serviços adicionais",
        "Prioridade no agendamento"
      ],
      destaque: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Nossos Planos
          </h1>
          <p className="text-gray-600 text-lg">
            Escolha o plano ideal para seus cuidados mensais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planos.map((plano) => (
            <div 
              key={plano.id}
              className={`
                bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB]
                transform transition-all duration-300 hover:scale-105
                ${plano.destaque ? 'md:scale-105' : ''}
              `}
            >
              {plano.destaque && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plano.nome}</h2>
                <div className="flex items-center justify-center">
                  <span className="text-4xl font-bold text-[#FF69B4]">{plano.preco}</span>
                  <span className="text-gray-600 ml-1">{plano.periodo}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plano.beneficios.map((beneficio, idx) => (
                  <div
                    key={idx}
                    className="group relative bg-white rounded-xl border border-[#FFB6C1] p-4 transition-all duration-300 hover:shadow-md hover:border-[#FF69B4]"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-[#FF69B4] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-gray-800 font-medium">{beneficio}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <Link
                  href={`/plano/${plano.id}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg w-full justify-center"
                >
                  Ver Detalhes
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>

                <Contract planoNome={plano.nome} planoPreco={plano.preco} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Todos os planos incluem acesso ao nosso programa de fidelidade e benefícios exclusivos.
            Para mais informações, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
} 