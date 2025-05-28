'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Star, Crown, Award, Heart, Sparkles } from 'lucide-react'
import '@/styles/plans.css'

const services = [
  {
    id: 'basico',
    name: 'Plano Básico',
    description: 'Cuidados básicos mensais',
    price: '40€/mês',
    icon: Star,
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
    icon: Crown,
    popular: true,
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
    icon: Sparkles,
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
      }
    )

    const planCards = document.querySelectorAll('.plan-card')
    planCards.forEach((card) => observer.observe(card))

    return () => {
      planCards.forEach((card) => observer.unobserve(card))
    }
  }, [])

  return (
    <section id="planos" className="py-24 bg-gradient-to-br from-white to-pink-50" ref={plansRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <span className="text-[#FFC0CB] font-medium text-sm uppercase tracking-wider">Planos Mensais</span>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Escolha o Plano Perfeito para Você
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Cuide da sua beleza com nossos planos personalizados. Escolha a opção que melhor se adapta às suas necessidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 plans-grid">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className={`plan-card opacity-0 transform translate-y-8 ${
                  service.id === 'balance' ? 'lg:-mt-4' : ''
                }`}
              >
                <div 
                  className={`relative p-8 h-full rounded-3xl transition-all duration-300 ${
                    service.id === 'balance'
                      ? 'bg-gradient-to-br from-pink-50 via-white to-pink-50 shadow-xl hover:shadow-2xl'
                      : 'bg-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-[#FFC0CB] text-white text-sm font-semibold shadow-lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Mais Popular
                      </div>
                    </div>
                  )}

                  {/* Ícone e Nome */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      service.id === 'balance' 
                        ? 'bg-gradient-to-br from-pink-100 to-pink-50'
                        : 'bg-pink-50'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        service.id === 'balance' ? 'text-pink-500' : 'text-[#FFC0CB]'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>

                  {/* Preço */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-[#FFC0CB] bg-clip-text text-transparent">
                        {service.price.split('/')[0]}
                      </span>
                      <span className="ml-2 text-gray-500">/mês</span>
                    </div>
                  </div>

                  {/* Linha divisória */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-100"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-sm text-gray-500">Benefícios inclusos</span>
                    </div>
                  </div>

                  {/* Lista de features */}
                  <div className="space-y-4 mb-8">
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
                  <div className="relative mt-auto">
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
                      Escolher Plano
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
            )
          })}
        </div>
      </div>
    </section>
  )
}