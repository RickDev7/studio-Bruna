'use client'

import { X } from 'lucide-react'

interface TermosCondicoesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function TermosCondicoesModal({ isOpen, onClose }: TermosCondicoesModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-pink-100">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            Termos e Condições
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-[#FF69B4]" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6 text-gray-600">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Planos e Fidelização</h3>
              <div className="space-y-3">
                <p>
                  1.1. Os planos oferecidos pelo Studio Bruna Silva - Aesthetic & Nails são divididos em três categorias:
                  Essencial, Equilíbrio e Premium.
                </p>
                <p>
                  1.2. A opção de fidelização oferece um desconto especial e requer um compromisso mínimo de 3 ou 6 meses.
                </p>
                <p>
                  1.3. O cancelamento antes do período mínimo de fidelização pode resultar em multa contratual.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Agendamentos e Cancelamentos</h3>
              <div className="space-y-3">
                <p>
                  2.1. Os serviços devem ser agendados com antecedência mínima de 24 horas.
                </p>
                <p>
                  2.2. Cancelamentos devem ser realizados com no mínimo 12 horas de antecedência.
                </p>
                <p>
                  2.3. No-shows ou cancelamentos tardios podem resultar na perda do serviço agendado.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Pagamentos</h3>
              <div className="space-y-3">
                <p>
                  3.1. Os pagamentos dos planos são realizados mensalmente.
                </p>
                <p>
                  3.2. Aceitamos cartões de crédito, débito e transferências bancárias.
                </p>
                <p>
                  3.3. O não pagamento pode resultar na suspensão dos serviços.
                </p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Benefícios e Serviços</h3>
              <div className="space-y-3">
                <p>
                  4.1. Os benefícios inclusos em cada plano não são cumulativos.
                </p>
                <p>
                  4.2. Os serviços não utilizados no mês não são transferidos para o mês seguinte.
                </p>
                <p>
                  4.3. Os descontos em serviços adicionais são válidos apenas durante a vigência do plano.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="border-t border-pink-100 p-6 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            Ao contratar qualquer um dos nossos planos, você concorda com todos os termos e condições aqui estabelecidos.
          </p>
        </div>
      </div>
    </div>
  )
} 