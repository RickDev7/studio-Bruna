'use client'

import React from 'react';

const servicos = [
  {
    categoria: 'Unhas',
    items: [
      'Manicure com Shellac',
      'Pedicure com Shellac',
      'Spa Pedicure',
      'Unhas em gel',
      'Reparos de unhas'
    ]
  },
  {
    categoria: 'Tratamentos Faciais',
    items: [
      'Limpeza facial',
      'Tratamento anti-idade',
      'Hidratação facial',
      'Microagulhamento',
      'Máscaras faciais'
    ]
  },
  {
    categoria: 'Design e Embelezamento',
    items: [
      'Design de sobrancelhas',
      'Coloração de sobrancelhas',
      'Brow lamination',
      'Lifting de pestanas'
    ]
  }
];

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Nossos Serviços
          </h1>
          <p className="text-gray-600 text-lg">
            Conheça todos os nossos serviços de estética e unhas
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          {servicos.map((categoria) => (
            <div
              key={categoria.categoria}
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 p-8 border border-[#FFC0CB] transform hover:scale-105"
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-6">
                {categoria.categoria}
              </h3>
              <ul className="space-y-4">
                {categoria.items.map((servico, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-[#FFB6C1] mr-3"
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
                    <span className="text-gray-600 hover:text-[#FF69B4] transition-colors duration-200">{servico}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/agendar"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            Agendar Horário
            <svg
              className="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
          </a>
        </div>
      </div>
    </div>
  );
} 