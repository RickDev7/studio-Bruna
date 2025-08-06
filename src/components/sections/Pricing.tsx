'use client'

import { Star, Check, Copy, AlertCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TermsAndConditions } from '@/components/TermsAndConditions'
import { useEffect, useRef, useState } from 'react'
import { DetalhesPlanoModal } from '@/components/DetalhesPlanoModal'

const planos = [
  {
    id: 'basico',
    nome: 'Plano Essencial',
    subtitulo: 'Cuidados básicos mensais',
    descricao: 'Cuidados básicos mensais para manter suas unhas sempre bonitas e saudáveis.',
    precoFidelidade: '40€',
    precoSemFidelidade: '45€',
    beneficios: [
      '1 Manicure com Shellac',
      '1 Pedicure simples',
      '10% de desconto em serviços adicionais'
    ],
    imagem: '/images/plano-basico.png'
  },
  {
    id: 'balance',
    nome: 'Plano Equilíbrio',
    subtitulo: 'Autocuidado completo',
    descricao: 'Autocuidado completo com serviços premium para sua beleza e bem-estar.',
    precoFidelidade: '65€',
    precoSemFidelidade: '70€',
    beneficios: [
      '1 Tratamento de unhas em gel',
      '1 Pedicure com Shellac',
      '1 Design de sobrancelhas',
      'Até 2 reparos de unhas',
      '10% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    imagem: '/images/plano-balance.png',
    destaque: true
  },
  {
    id: 'premium',
    nome: 'Plano Premium',
    subtitulo: 'Experiência VIP',
    descricao: 'Experiência VIP com tratamentos exclusivos e benefícios especiais.',
    precoFidelidade: '115€',
    precoSemFidelidade: '130€',
    beneficios: [
      '1 Spa pedicure com Shellac',
      '1 Tratamento de unhas em gel',
      '1 Limpeza facial',
      '1 Design de sobrancelhas',
      'Reparos ilimitados de unhas',
      '15% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    imagem: '/images/plano-premium.png'
  }
]

interface PlanoSelecionadoType {
  nome: string
  valor: string
  tipo: 'fidelidade' | 'sem_fidelidade'
}

export function Pricing() {
  const sectionRef = useRef<HTMLElement>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<typeof planos[0] | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [finalizacaoAberta, setFinalizacaoAberta] = useState(false)
  const [planoFinalizacao, setPlanoFinalizacao] = useState<PlanoSelecionadoType | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.plan-card')
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-in')
              }, index * 200)
            })
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      const currentRef = sectionRef.current
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="planos"
      className="py-24 bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-[#FF69B4] font-medium text-sm uppercase tracking-wider">
            Planos Mensais
          </span>
          <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            Escolha o Plano Perfeito para Você
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Cuide da sua beleza com nossos planos personalizados. Escolha a opção que melhor se adapta às suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {planos.map((plano, index) => (
            <div
              key={plano.id}
              className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-pink-100 overflow-hidden"
            >
              {/* Efeito de gradiente no hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative">
                {/* Badge de Mais Popular */}
                {plano.destaque && (
                  <div className="absolute -top-4 right-0 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg z-10">
                    Mais Popular
                  </div>
                )}

                {/* Imagem do Plano */}
                <div className="relative mb-8 transform group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative h-[200px] w-full rounded-2xl overflow-hidden">
                    <Image
                      src={plano.imagem}
                      alt={plano.nome}
                      fill
                      className={`object-cover transition-transform duration-300 group-hover:scale-110 ${
                        plano.id === 'balance' || plano.id === 'premium' 
                          ? 'object-[center_25%]' 
                          : 'object-center'
                      }`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>

                {/* Ícone e Título */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFB6C1] to-[#FF69B4] p-0.5 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
                    <Star className="h-8 w-8 text-[#FF69B4] transform group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-[#FF69B4] transition-colors duration-300">
                  {plano.nome}
                </h3>
                <p className="mt-2 text-gray-600">{plano.subtitulo}</p>

                {/* Preços */}
                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] p-6 rounded-2xl text-white">
                    <p className="text-sm font-medium mb-2">Com Fidelização</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">{plano.precoFidelidade}</span>
                      <span className="ml-1 text-sm">/mês</span>
                    </div>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-2xl">
                    <p className="text-sm font-medium text-gray-800 mb-2">Sem Fidelização</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-800">{plano.precoSemFidelidade}</span>
                      <span className="ml-1 text-sm text-gray-600">/mês</span>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Benefícios Inclusos</h4>
                  <ul className="space-y-3">
                    {plano.beneficios.map((beneficio, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                        <Check className="w-5 h-5 text-[#FF69B4] mr-3 flex-shrink-0" />
                        <span>{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botões de Ação */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => {
                      setPlanoFinalizacao({
                        nome: plano.nome,
                        valor: plano.precoFidelidade,
                        tipo: 'fidelidade'
                      })
                      setFinalizacaoAberta(true)
                    }}
                    className="block w-full py-3 px-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full font-medium text-center hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    Escolher Com Fidelização
                  </button>
                  
                  <button
                    onClick={() => {
                      setPlanoFinalizacao({
                        nome: plano.nome,
                        valor: plano.precoSemFidelidade,
                        tipo: 'sem_fidelidade'
                      })
                      setFinalizacaoAberta(true)
                    }}
                    className="block w-full py-3 px-4 bg-white text-[#FF69B4] rounded-full font-medium border-2 border-[#FFB6C1] text-center hover:border-[#FF69B4] transition-all duration-300 transform hover:scale-105"
                  >
                    Escolher Sem Fidelização
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <TermsAndConditions />
                </div>

                {/* Link Saiba Mais */}
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      setPlanoSelecionado(plano)
                      setModalAberto(true)
                    }}
                    className="inline-flex items-center text-[#FF69B4] hover:text-[#FF1493] transition-colors duration-300 group/link text-sm"
                  >
                    <span className="border-b border-transparent group-hover/link:border-[#FF1493]">
                      Saiba mais sobre este plano
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 transform group-hover/link:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Detalhes do Plano */}
      {planoSelecionado && (
        <DetalhesPlanoModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false)
            setPlanoSelecionado(null)
          }}
          plano={{
            nome: planoSelecionado.nome,
            descricao: planoSelecionado.descricao,
            imagem: planoSelecionado.imagem,
            beneficios: planoSelecionado.beneficios,
            precoFidelidade: planoSelecionado.precoFidelidade,
            precoSemFidelidade: planoSelecionado.precoSemFidelidade
          }}
        />
      )}

      {/* Modal de Finalização */}
      {planoFinalizacao && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${
            finalizacaoAberta ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setFinalizacaoAberta(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl transform transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
                Finalizar Assinatura
              </h2>
              <p className="text-gray-600 mb-8">
                Por favor, utilize as informações bancárias abaixo para realizar sua transferência
              </p>

              {/* Plano Selecionado */}
              <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white mb-8">
                <h3 className="text-lg font-medium mb-2">Plano Selecionado</h3>
                <p className="text-2xl font-bold mb-2">{planoFinalizacao.nome}</p>
                <p className="text-lg">
                  {planoFinalizacao.tipo === 'fidelidade' ? 'Com Fidelização' : 'Sem Fidelização'}
                </p>
                <p className="text-3xl font-bold mt-4">{planoFinalizacao.valor}/mês</p>
              </div>

              {/* Dados Bancários */}
              <div className="space-y-4">
                {[
                  { label: 'Banco', value: 'N26 Bank' },
                  { label: 'Nome', value: 'BRUNA RAFAELA PEREIRA DA SILVA' },
                  { label: 'IBAN', value: 'DE13 1001 1001 2518 5510 36' },
                  { label: 'BIC/SWIFT', value: 'NTSBDEB1XXX' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-xl border border-[#FFB6C1] flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="text-lg font-medium text-gray-800">{item.value}</p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.value)}
                      className="p-2 hover:bg-pink-50 rounded-full transition-colors"
                    >
                      <Copy className="w-5 h-5 text-[#FF69B4]" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Informações Importantes */}
              <div className="mt-8 bg-pink-50 p-6 rounded-xl border border-[#FFB6C1]">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-[#FF69B4] mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Importante</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-3">
                      <li>Guarde o comprovante de transferência</li>
                      <li>O processamento pode levar até 2 dias úteis</li>
                      <li>Após confirmação do pagamento, entraremos em contato com você</li>
                    </ul>
                    <div className="mt-6 bg-white p-4 rounded-lg border border-[#FFB6C1]">
                      <p className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 text-[#FF69B4] mr-3" />
                        Envie o comprovante para nosso WhatsApp:{' '}
                        <a
                          href="https://wa.me/4915208007814"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-1 font-medium text-[#FF69B4] hover:underline"
                        >
                          +49 152 080 07814
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão Voltar */}
              <div className="mt-8 text-center">
                <button
                  onClick={() => setFinalizacaoAberta(false)}
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-full text-[#FF69B4] border-2 border-[#FFB6C1] hover:bg-[#FFB6C1] hover:text-white transition-all duration-300"
                >
                  Voltar para os Planos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 