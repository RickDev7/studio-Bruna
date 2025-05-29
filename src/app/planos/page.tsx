'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { TermsAndConditions } from '@/components/TermsAndConditions';
import { Star, Crown, Sparkles } from 'lucide-react';
import '@/app/styles/plans.css';

export default function PlanosPage() {
  useEffect(() => {
    const cards = document.querySelectorAll('.plan-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  const planos = [
    {
      id: 'basico',
      nome: "Plano Básico",
      descricao: "Cuidados básicos mensais",
      precoFidelidade: "40€",
      precoSemFidelidade: "45€",
      icon: Star,
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
      descricao: "Autocuidado completo",
      precoFidelidade: "65€",
      precoSemFidelidade: "70€",
      icon: Crown,
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
      descricao: "Experiência VIP",
      precoFidelidade: "115€",
      precoSemFidelidade: "130€",
      icon: Sparkles,
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 plans-grid">
          {planos.map((plano) => {
            const Icon = plano.icon;
            return (
              <div key={plano.id} className="plan-card opacity-0 transform translate-y-8 animate-in">
                <div className={`relative p-8 h-full rounded-3xl transition-all duration-300 bg-white/90 backdrop-blur-sm border ${plano.destaque ? 'border-[#FF69B4] shadow-xl hover:shadow-2xl scale-105' : 'border-[#FFC0CB] shadow-lg hover:shadow-xl hover:scale-105'}`}>
                  {plano.destaque && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white text-sm font-semibold shadow-lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br from-[#FFB6C1] to-[#FFE4E1]">
                      <Icon className={`w-8 h-8 ${plano.destaque ? 'text-[#FF69B4]' : 'text-[#FFB6C1]'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plano.nome}</h3>
                    <p className="text-gray-600">{plano.descricao}</p>
                  </div>

                  {/* Preços e Botões */}
                  <div className="space-y-6 mb-8">
                    {/* Com Fidelização */}
                    <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white">
                      <p className="text-sm font-medium mb-1">Com Fidelização</p>
                      <p className="text-xs mb-2">(3 ou 6 meses)</p>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-3xl font-bold">{plano.precoFidelidade}</span>
                        <span className="ml-1">/mês</span>
                      </div>
                      <Link
                        href={`/pagamento?plano=${encodeURIComponent(plano.nome)}&valor=${encodeURIComponent(plano.precoFidelidade)}&tipo=fidelidade`}
                        className="block w-full py-2 px-4 bg-white text-gray-900 rounded-full font-medium border-2 border-[#FFB6C1] hover:bg-gradient-to-r hover:from-[#FFE4E1] hover:to-[#FFF0F5] hover:border-[#FF69B4] hover:text-gray-900 hover:scale-105 transform transition-all duration-300 text-center shadow-sm hover:shadow-md"
                      >
                        Escolher Com Fidelização
                      </Link>
                    </div>

                    {/* Sem Fidelização */}
                    <div className="bg-white p-6 rounded-2xl text-gray-800 border-2 border-[#FFB6C1]">
                      <p className="text-sm font-medium mb-1">Sem Fidelização</p>
                      <p className="text-xs mb-2 text-transparent">.</p>
                      <div className="flex items-center justify-center mb-4">
                        <span className="text-2xl font-bold">{plano.precoSemFidelidade}</span>
                        <span className="ml-1 text-gray-600">/mês</span>
                      </div>
                      <Link
                        href={`/pagamento?plano=${encodeURIComponent(plano.nome)}&valor=${encodeURIComponent(plano.precoSemFidelidade)}&tipo=sem_fidelidade`}
                        className="block w-full py-2 px-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 text-center"
                      >
                        Escolher Sem Fidelização
                      </Link>
                    </div>

                    <div className="text-center mt-2">
                      <TermsAndConditions />
                    </div>
                  </div>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#FFE4E1]"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500">Benefícios inclusos</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {plano.beneficios.map((beneficio, idx) => (
                      <div key={idx} className="feature-item flex items-start">
                        <div className="flex-shrink-0">
                          <svg className={`h-5 w-5 ${plano.destaque ? 'text-[#FF69B4]' : 'text-[#FFB6C1]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="ml-3 text-base text-gray-600">{beneficio}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Todos os planos incluem acesso ao nosso programa de fidelidade e benefícios exclusivos.
            Para mais informações, entre em contato conosco.
          </p>
          <div className="mt-8">
            <TermsAndConditions />
          </div>
        </div>
      </div>
    </div>
  );
} 