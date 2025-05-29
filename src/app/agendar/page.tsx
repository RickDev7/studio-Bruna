import React from 'react';
import { Scheduling } from '@/components/sections/Scheduling';

export default function AgendarPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB]">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
              Agende seu Horário
            </h1>
            <p className="text-gray-600 text-lg">
              Escolha o serviço, data e horário de sua preferência
            </p>
          </div>
          
          <Scheduling />
        </div>
      </div>
    </div>
  );
} 