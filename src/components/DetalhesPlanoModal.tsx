'use client'

import { X, Check } from 'lucide-react'
import Image from 'next/image'

interface DetalhesPlanoModalProps {
  isOpen: boolean
  onClose: () => void
  plano: {
    nome: string
    descricao: string
    imagem: string
    beneficios: string[]
    precoFidelidade: string
    precoSemFidelidade: string
  }
}

export function DetalhesPlanoModal({ isOpen, onClose, plano }: DetalhesPlanoModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            {plano.nome}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#FF69B4]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="relative h-[300px] w-full rounded-2xl overflow-hidden mb-6">
                <Image
                  src={plano.imagem}
                  alt={plano.nome}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Descrição</h3>
                <p className="text-gray-600 leading-relaxed">{plano.descricao}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-pink-50/30 p-6 rounded-2xl border border-pink-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefícios Inclusos</h3>
                <ul className="space-y-3">
                  {plano.beneficios.map((beneficio, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <Check className="w-5 h-5 text-[#FF69B4] mr-3" />
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white">
                  <p className="text-sm font-medium mb-1">Com Fidelização</p>
                  <p className="text-xs mb-2">(3 ou 6 meses)</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{plano.precoFidelidade}</span>
                    <span className="ml-2 text-sm">/mês</span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-[#FFB6C1]">
                  <p className="text-sm font-medium text-gray-800 mb-1">Sem Fidelização</p>
                  <p className="text-xs text-gray-500 mb-2">Maior flexibilidade</p>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-800">{plano.precoSemFidelidade}</span>
                    <span className="ml-2 text-sm text-gray-600">/mês</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-pink-100 p-6 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Para mais informações ou para agendar uma consulta, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  )
} 