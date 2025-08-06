'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export function TermsAndConditions() {
  const [isOpen, setIsOpen] = useState(false)

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
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Termos e Condições</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Planos de Fidelização</h3>
                <p className="text-gray-600">
                  Os planos de fidelização têm duração mínima de 3 ou 6 meses, com pagamento mensal. O cliente se compromete a manter o plano pelo período escolhido.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Cancelamento</h3>
                <p className="text-gray-600">
                  Para planos sem fidelização, o cancelamento pode ser feito a qualquer momento, com aviso prévio de 30 dias.
                  Para planos com fidelização, o cancelamento antes do término do período contratado pode implicar em multa.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Agendamentos</h3>
                <p className="text-gray-600">
                  Os serviços inclusos no plano devem ser agendados com antecedência mínima de 24 horas.
                  O não comparecimento sem aviso prévio de 24 horas implica na perda do serviço do mês.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Benefícios</h3>
                <p className="text-gray-600">
                  Os descontos e benefícios são pessoais e intransferíveis.
                  Os serviços inclusos no plano não são cumulativos e devem ser utilizados dentro do mês vigente.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Pagamento</h3>
                <p className="text-gray-600">
                  O pagamento é mensal e deve ser efetuado até o dia escolhido no momento da contratação.
                  O não pagamento pode resultar na suspensão dos serviços até a regularização.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Reajustes</h3>
                <p className="text-gray-600">
                  Os valores dos planos podem ser reajustados anualmente, com aviso prévio de 30 dias.
                  Para planos com fidelização, o valor permanece fixo durante o período contratado.
                </p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 