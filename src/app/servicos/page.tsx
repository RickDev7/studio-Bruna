'use client'

import React from 'react';
import { services } from '@/config/services';

const servicos = [
  {
    categoria: 'Unhas',
    items: services.filter(s => s.category === 'nails').map(s => s.name)
  },
  {
    categoria: 'Tratamentos Faciais',
    items: services.filter(s => s.category === 'face').map(s => s.name)
  },
  {
    categoria: 'Sobrancelhas & Pestanas',
    items: services.filter(s => s.category === 'eyebrows').map(s => s.name)
  },
  {
    categoria: 'Depilação',
    items: services.filter(s => s.category === 'waxing').map(s => s.name)
  }
];

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
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
    </div>
  );
} 