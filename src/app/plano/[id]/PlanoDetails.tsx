'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface PlanoDetalhes {
  id: string
  nome: string
  descricao: string
  preco: string
  servicos: string[]
  beneficios: string[]
  imagem: string
}

interface PlanoDetailsProps {
  plano: PlanoDetalhes
}

export function PlanoDetails({ plano }: PlanoDetailsProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Imagem do Plano */}
            <div className="relative h-64 lg:h-full">
              <Image
                src={plano.imagem}
                alt={plano.nome}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
              />
            </div>

            {/* Detalhes do Plano */}
            <div className="p-8 lg:p-12">
              <div className="space-y-6">
                {/* Cabeçalho */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{plano.nome}</h1>
                  <p className="text-xl text-gray-600">{plano.descricao}</p>
                </div>

                {/* Preços */}
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-semibold text-[#FFC0CB]">{plano.preco}</div>
                  </div>
                </div>

                {/* Serviços */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Serviços Incluídos:</h2>
                  <ul className="space-y-3">
                    {plano.servicos.map((servico, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <svg className="h-5 w-5 text-[#FFC0CB] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {servico}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefícios */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefícios:</h2>
                  <div className="space-y-4">
                    {plano.beneficios.map((beneficio, index) => (
                      <p key={index} className="text-gray-600">{beneficio}</p>
                    ))}
                  </div>
                </div>

                {/* Botões */}
                <div className="space-y-4 pt-6">
                  <a
                    href={`/pagamento?valor=${encodeURIComponent(plano.preco)}&plano=${encodeURIComponent(plano.nome)}`}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-full bg-[#FFC0CB] hover:bg-[#FFB6C1] text-white font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                  >
                    Assinar Plano
                    <svg
                      className="ml-2 -mr-1 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full flex items-center justify-center py-3 px-4 rounded-full border-2 border-[#FFC0CB] text-[#FFC0CB] hover:bg-[#FFC0CB] hover:text-white font-medium transition-all duration-300 hover:shadow-lg group"
                  >
                    <svg
                      className="mr-2 w-5 h-5 transform transition-transform duration-300 group-hover:-translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Voltar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 