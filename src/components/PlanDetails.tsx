'use client'

import Image from 'next/image';
import { X, Star, Check } from 'lucide-react';
import Link from 'next/link';

interface PlanDetailsProps {
  plan: {
    name: string;
    description: string;
    precoFidelidade: string;
    precoSemFidelidade: string;
    imagem: string;
    beneficios: string[];
    destaque?: boolean;
  };
  onClose: () => void;
  isOpen: boolean;
}

export function PlanDetails({ plan, onClose, isOpen }: PlanDetailsProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div 
        className={`relative bg-white shadow-2xl transform transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
          w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-4xl
          max-h-[90vh] rounded-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com gradiente */}
        <div className="sticky top-0 z-10 bg-white border-b border-pink-100">
          <div className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                {plan.name}
              </h2>
              {plan.destaque && (
                <div className="flex items-center mt-2 text-[#FF69B4]">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  <span className="text-sm font-medium">Plano Mais Popular</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
              aria-label="Fechar detalhes"
            >
              <X className="w-6 h-6 text-[#FF69B4]" />
            </button>
          </div>
        </div>

        {/* Conteúdo com scroll */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-8">
            {/* Grid de 2 colunas para desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Coluna da esquerda */}
              <div className="space-y-6">
                {/* Imagem com overlay gradiente */}
                <div className="relative h-[300px] w-full rounded-2xl overflow-hidden group shadow-lg">
                  <Image
                    src={plan.imagem}
                    alt={plan.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Descrição */}
                <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#FF69B4] to-[#FFB6C1] rounded-full mr-3"></span>
                    Descrição
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{plan.description}</p>
                </div>
              </div>

              {/* Coluna da direita */}
              <div className="space-y-6">
                {/* Benefícios */}
                <div className="bg-gradient-to-br from-white to-pink-50/30 p-6 rounded-2xl border border-pink-100 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-gradient-to-b from-[#FF69B4] to-[#FFB6C1] rounded-full mr-3"></span>
                    Benefícios Inclusos
                  </h3>
                  <ul className="space-y-3">
                    {plan.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center text-gray-600 group">
                        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          <Check className="w-5 h-5 text-[#FF69B4] transform group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="ml-3">{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preços */}
                <div className="space-y-4">
                  {/* Com Fidelização */}
                  <Link
                    href={`/pagamento?plano=${encodeURIComponent(plan.name)}&valor=${encodeURIComponent(plan.precoFidelidade)}&tipo=fidelidade`}
                    className="block bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white transform hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium">Com Fidelização</p>
                        <p className="text-xs opacity-90">(3 ou 6 meses)</p>
                      </div>
                      <div className="bg-white/20 rounded-full px-3 py-1">
                        <p className="text-xs font-medium">Melhor Valor!</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold">{plan.precoFidelidade}</span>
                        <span className="ml-2 text-sm opacity-90">/mês</span>
                      </div>
                      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Contratar →
                      </span>
                    </div>
                  </Link>

                  {/* Sem Fidelização */}
                  <Link
                    href={`/pagamento?plano=${encodeURIComponent(plan.name)}&valor=${encodeURIComponent(plan.precoSemFidelidade)}&tipo=sem_fidelidade`}
                    className="block border-2 border-[#FFB6C1] p-6 rounded-2xl bg-white transform hover:scale-[1.02] transition-transform shadow-sm hover:shadow-md group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">Sem Fidelização</p>
                        <p className="text-xs text-gray-500">Maior flexibilidade</p>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-800">{plan.precoSemFidelidade}</span>
                        <span className="ml-2 text-sm text-gray-600">/mês</span>
                      </div>
                      <span className="text-sm font-medium text-[#FF69B4] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Contratar →
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="sticky bottom-0 bg-white border-t border-pink-100 py-8 px-6 -mx-6 mt-auto">
              <Link 
                href="/#planos"
                className="w-full max-w-md mx-auto block py-4 px-8 text-[#FF69B4] border-2 border-[#FFB6C1] rounded-full font-medium text-center
                  hover:bg-[#FFB6C1] hover:text-white
                  transition-all duration-300 
                  shadow-[0_4px_20px_-5px_rgba(255,105,180,0.5)]
                  hover:shadow-[0_8px_25px_-5px_rgba(255,105,180,0.6)]
                  transform hover:scale-[1.02]
                  active:scale-[0.98]"
              >
                Voltar para os Planos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 