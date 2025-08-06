'use client'

import Image from 'next/image'
import { X, Star, Check } from 'lucide-react'
import Link from 'next/link'

interface PlanDetailsProps {
  plan: {
    name: string
    description: string
    precoFidelidade: string
    precoSemFidelidade: string
    imagem: string
    beneficios: string[]
    destaque?: boolean
  }
  onClose: () => void
  isOpen: boolean
}

export function PlanDetails({ plan, onClose, isOpen }: PlanDetailsProps) {
  if (!isOpen) return null

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
        <div className="overflow-y-auto">
          <div className="p-6">
            {/* Imagem e descrição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={plan.imagem}
                  alt={plan.name}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-gray-600 text-lg mb-6">{plan.description}</p>
                <div className="space-y-4">
                  {plan.beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-[#FF69B4] mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Opções de preço */}
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

        {/* Footer com botão de fechar */}
        <div className="sticky bottom-0 bg-white border-t border-pink-100 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full font-medium hover:opacity-90 transition-opacity duration-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
} 