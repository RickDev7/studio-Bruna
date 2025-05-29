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
    <section id="planos" className="py-24 bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]" ref={plansRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#FF69B4] font-medium text-sm uppercase tracking-wider">Planos Mensais</span>
          <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
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
                className="plan-card opacity-0 transform translate-y-8"
              >
                <div 
                  className={`relative p-8 h-full rounded-3xl transition-all duration-300 bg-white/90 backdrop-blur-sm border ${
                    service.popular
                      ? 'border-[#FF69B4] shadow-xl hover:shadow-2xl scale-105'
                      : 'border-[#FFC0CB] shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white text-sm font-semibold shadow-lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Mais Popular
                      </div>
                    </div>
                  )}

                  {/* Ícone e Nome */}
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                      service.popular 
                        ? 'bg-gradient-to-br from-[#FFB6C1] to-[#FFE4E1]'
                        : 'bg-gradient-to-br from-[#FFC0CB] to-white'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        service.popular ? 'text-[#FF69B4]' : 'text-[#FFB6C1]'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>

                  {/* Preço */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-extrabold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
                        {service.price.split('/')[0]}
                      </span>
                      <span className="ml-2 text-gray-500">/mês</span>
                    </div>
                  </div>

                  {/* Linha divisória */}
                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#FFE4E1]"></div>
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
                            className={`h-5 w-5 ${service.popular ? 'text-[#FF69B4]' : 'text-[#FFB6C1]'}`}
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
                          service.popular
                            ? 'bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white hover:shadow-lg hover:scale-105'
                            : 'bg-white text-[#FF69B4] border-2 border-[#FFB6C1] hover:bg-gradient-to-r hover:from-[#FFB6C1] hover:to-[#FF69B4] hover:text-white hover:border-transparent hover:scale-105'
                        }
                      `}
                    >
                      Escolher Plano
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