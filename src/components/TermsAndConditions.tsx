'use client'

import React, { useState } from 'react';
import { X } from 'lucide-react';

export function TermsAndConditions() {
  const [isOpen, setIsOpen] = useState(false);

  const terms = [
    {
      title: 'Fidelização',
      items: [
        'O período de fidelização é de 3 ou 6 meses, conforme escolha do cliente',
        'O valor mensal com fidelização oferece um desconto em relação ao plano sem fidelização',
        'O pagamento deve ser realizado mensalmente até o dia escolhido no momento da contratação',
        'Em caso de cancelamento antes do término do período de fidelização, será cobrada uma taxa proporcional ao período restante'
      ]
    },
    {
      title: 'Agendamento',
      items: [
        'Os serviços devem ser agendados com antecedência mínima de 24 horas',
        'Em caso de impossibilidade de comparecimento, o cancelamento deve ser feito com 24 horas de antecedência',
        'Faltas sem aviso prévio ou cancelamentos com menos de 24 horas serão considerados como serviço realizado',
        'Os horários disponíveis estão sujeitos à agenda do estúdio'
      ]
    },
    {
      title: 'Serviços',
      items: [
        'Os serviços inclusos no plano são pessoais e intransferíveis',
        'Serviços não utilizados no mês não acumulam para o mês seguinte',
        'O desconto em serviços adicionais é válido apenas para a titular do plano',
        'Os serviços devem ser realizados dentro do horário de funcionamento do estúdio'
      ]
    },
    {
      title: 'Pagamento',
      items: [
        'O pagamento pode ser realizado via transferência bancária',
        'O não pagamento até a data acordada pode resultar na suspensão dos serviços',
        'Os valores dos planos podem ser reajustados anualmente',
        'Em caso de reajuste, os clientes serão notificados com 30 dias de antecedência'
      ]
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-[#FF69B4] hover:text-[#FFB6C1] transition-colors duration-200 underline"
      >
        Ver Termos e Condições
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 rounded-t-2xl flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Termos e Condições</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {terms.map((section) => (
                <div key={section.title}>
                  <h4 className="text-lg font-semibold text-[#FF69B4] mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.items.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-[#FFB6C1] mr-3 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="mt-8 p-4 bg-pink-50 rounded-xl">
                <p className="text-sm text-gray-600">
                  Ao contratar qualquer um dos nossos planos, você concorda com todos os termos e condições
                  acima. Em caso de dúvidas, nossa equipe está à disposição para esclarecimentos.
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 rounded-b-2xl">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
              >
                Entendi e Concordo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 