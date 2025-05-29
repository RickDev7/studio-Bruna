'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { TermsAndConditions } from '@/components/TermsAndConditions'

interface PlanoDetalhes {
  id: string
  nome: string
  descricao: string
  precoFidelidade: string
  precoSemFidelidade: string
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
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-[#FFC0CB]">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Coluna da Imagem */}
            <div className="lg:w-1/3">
              <div className="sticky top-8">
                <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                  <Image
                    src={plano.imagem}
                    alt={plano.nome}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Coluna do Conteúdo */}
            <div className="lg:w-2/3">
              <div className="text-center lg:text-left mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
                  {plano.nome}
                </h1>
                <p className="text-gray-600 text-lg">
                  {plano.descricao}
                </p>
              </div>

              {/* Preços */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white text-center transform hover:scale-105 transition-transform duration-300 shadow-lg">
                    <h2 className="text-lg font-medium mb-2">Com Fidelização</h2>
                    <p className="text-sm mb-2">(3 ou 6 meses)</p>
                    <p className="text-3xl font-bold">{plano.precoFidelidade}/mês</p>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white p-6 rounded-2xl text-gray-800 text-center border-2 border-[#FFB6C1] transform hover:scale-105 transition-transform duration-300 shadow-lg">
                    <h2 className="text-lg font-medium mb-2">Sem Fidelização</h2>
                    <p className="text-sm mb-2">&nbsp;</p>
                    <p className="text-3xl font-bold">{plano.precoSemFidelidade}/mês</p>
                  </div>
                </div>
              </div>

              {/* Serviços Incluídos */}
              <div className="space-y-6 mb-8">
                <h3 className="text-2xl font-medium text-gray-800">Serviços Incluídos</h3>
                <div className="grid gap-4">
                  {plano.servicos.map((servico, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-xl border border-[#FFB6C1] p-4 transition-all duration-300 hover:shadow-md hover:border-[#FF69B4]"
                    >
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-[#FF69B4] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-gray-800 font-medium">{servico}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-6 mb-12">
                <h3 className="text-2xl font-medium text-gray-800">Benefícios</h3>
                <div className="grid gap-4">
                  {plano.beneficios.map((beneficio, index) => (
                    <div
                      key={index}
                      className="group relative bg-white rounded-xl border border-[#FFB6C1] p-4 transition-all duration-300 hover:shadow-md hover:border-[#FF69B4]"
                    >
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-[#FF69B4] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-800 font-medium">{beneficio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href={`/pagamento?valor=${encodeURIComponent(plano.precoFidelidade)}&plano=${encodeURIComponent(plano.nome)}`}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] hover:from-[#FF69B4] hover:to-[#FFB6C1] transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Assinar Plano
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
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

                <button
                  onClick={() => router.back()}
                  className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-full text-[#FF69B4] hover:text-white bg-white hover:bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] border-2 border-[#FFB6C1] transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Voltar
                </button>

                <TermsAndConditions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 