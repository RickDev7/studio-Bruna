'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Star, Crown, Award, Heart } from 'lucide-react'
import '@/styles/plans.css'

const services = [
  {
    id: 'basico',
    name: 'Plano Básico',
    description: 'Cuidados básicos mensais',
    price: '40€/mês',
    features: [
      '1 Manicure com Shellac',
      '1 Pedicure simples',
      '10% de desconto em serviços adicionais'
    ]
  },
  {
    id: 'balance',
    name: 'Plano Balance',
    description: 'Autocuidado completo',
    price: '65€/mês',
    features: [
      '1 Tratamento de unhas em gel',
      '1 Pedicure com Shellac',
      '1 Design de sobrancelhas',
      'Até 2 reparos de unhas',
      '10% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ]
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    description: 'Experiência VIP',
    price: '115€/mês',
    features: [
      '1 Spa pedicure com Shellac',
      '1 Tratamento de unhas em gel',
      '1 Limpeza facial',
      '1 Design de sobrancelhas',
      'Reparos ilimitados de unhas',
      '15% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ]
  }
]

export function Services() {
  const router = useRouter()
  const plansRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    )

    const cards = document.querySelectorAll('.plan-card')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-white to-pink-50" id="servicos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fade-in">
          <span className="text-[#FFC0CB] font-medium text-sm uppercase tracking-wider">Planos Mensais</span>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Escolha o Plano Perfeito para Você
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Cuide da sua beleza com nossos planos personalizados. Escolha a opção que melhor se adapta às suas necessidades.
          </p>
        </div>

        <div ref={plansRef} className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3 relative plans-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`plan-card relative bg-white rounded-3xl shadow-xl overflow-hidden opacity-0 translate-y-8
                ${service.id === 'balance' ? 'lg:-mt-4 lg:mb-4' : ''}
                ${index === 0 ? 'animate-delay-100' : index === 1 ? 'animate-delay-200' : 'animate-delay-300'}
              `}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
            >
              {service.id === 'balance' && (
                <>
                  {/* Badge superior direito */}
                  <div className="absolute -right-2 top-0 z-10">
                    <div className="popular-badge flex items-center">
                      {/* Parte principal do badge */}
                      <div className="bg-gradient-to-r from-pink-500 to-[#FFC0CB] 
                        text-white pl-4 pr-3 py-1 rounded-l-full shadow-xl flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-300" />
                        <span className="text-sm font-bold tracking-wide whitespace-nowrap">Mais Popular</span>
                      </div>
                      {/* Elemento decorativo */}
                      <div className="w-2 h-5 bg-gradient-to-b from-pink-500 to-[#FFC0CB] rounded-r-full" />
                    </div>
                    {/* Sombra decorativa */}
                    <div className="absolute -right-1 top-0 w-2 h-2 bg-pink-700 rounded-br-full transform rotate-45" />
                  </div>

                  {/* Logo decorativo de fundo */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute right-0 bottom-0 opacity-[0.02] transform">
                      <Heart className="w-64 h-64 text-pink-500" strokeWidth={0.5} />
                    </div>
                  </div>
                </>
              )}
              
              <div className={`p-8 relative ${
                service.id === 'balance' 
                  ? 'bg-gradient-to-br from-pink-50/30 via-white to-pink-50/20 rounded-2xl pt-10' 
                  : ''
              }`}>
                {/* Cabeçalho com nome e preço */}
                <div className="flex flex-col mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">{service.name}</h3>
                    <div className="flex items-baseline price-tag z-20">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-[#FFC0CB] bg-clip-text text-transparent">
                        {service.price.split('/')[0]}
                      </span>
                      <span className="ml-2 text-gray-500">/mês</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                {/* Linha divisória decorativa */}
                {service.id === 'balance' && (
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-6 py-1 rounded-full border border-pink-100">
                        <Crown className="w-5 h-5 text-[#FFC0CB]" />
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Lista de features */}
                <div className="space-y-5 mb-8">
                  {service.features.map((feature, index) => (
                    <div key={index} className="feature-item flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className={`h-5 w-5 ${service.id === 'balance' ? 'text-pink-500' : 'text-[#FFC0CB]'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-600">{feature}</p>
                    </div>
                  ))}
                </div>

                {/* Botão de ação */}
                <div className="relative">
                  <button
                    onClick={() => router.push(`/plano/${service.id}`)}
                    className={`plan-button w-full group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full transition-all duration-300
                      ${
                        service.id === 'balance'
                          ? 'bg-gradient-to-r from-pink-500 to-[#FFC0CB] text-white hover:shadow-pink-xl'
                          : 'bg-white text-[#FFC0CB] border-2 border-[#FFC0CB] hover:bg-[#FFC0CB] hover:text-white'
                      }
                      transform hover:-translate-y-1 hover:shadow-lg
                    `}
                  >
                    Ver Detalhes
                    <svg
                      className="ml-2 -mr-1 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 