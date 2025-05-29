'use client'

import React from 'react';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Sobre o Studio Bruna
          </h1>
          <p className="text-gray-600 text-lg">
            Conheça nossa história e compromisso com a beleza
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossa Missão</h3>
              <p className="text-gray-600 leading-relaxed">
                Nosso compromisso é realçar a beleza natural de cada cliente, oferecendo serviços personalizados
                e de alta qualidade. Buscamos não apenas resultados estéticos excepcionais, mas também
                proporcionar uma experiência relaxante e acolhedora.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossos Valores</h3>
              <ul className="space-y-4">
                {[
                  'Excelência em cada atendimento',
                  'Compromisso com a satisfação do cliente',
                  'Ambiente acolhedor e higienizado',
                  'Profissionais altamente qualificados',
                  'Produtos de primeira qualidade'
                ].map((valor, index) => (
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
                    <span className="text-gray-600">{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Nossa História</h3>
              <p className="text-gray-600 leading-relaxed">
                O Studio Bruna nasceu do sonho de proporcionar serviços de estética de alta qualidade em Cuxhaven.
                Com anos de experiência e formação especializada, nossa equipe se dedica a oferecer o melhor em
                cuidados de beleza, combinando técnicas tradicionais com as mais recentes inovações do setor.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-[#FFC0CB] transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#FF69B4] mb-4">Localização</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Estamos localizados em um ponto privilegiado de Cuxhaven, com fácil acesso e estacionamento.
                Nosso espaço foi pensado para proporcionar conforto e tranquilidade durante seu momento de
                cuidado pessoal.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-[#FF69B4] hover:text-[#FFB6C1] transition-colors duration-200"
              >
                Ver no Google Maps
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <a
            href="/agendar"
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
          >
            Agendar Horário
          </a>
        </div>
      </div>
    </div>
  );
} 