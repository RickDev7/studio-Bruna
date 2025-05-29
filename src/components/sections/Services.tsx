'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Star, Crown, Award, Heart, Sparkles } from 'lucide-react'
import '@/styles/plans.css'
import Link from 'next/link'
import { TermsAndConditions } from '@/components/TermsAndConditions'

const services = [
  {
    id: 'basico',
    name: 'Plano Básico',
    description: 'Cuidados básicos mensais',
    precoFidelidade: '40€',
    precoSemFidelidade: '45€',
    icon: Star,
    beneficios: [
      '1 Manicure com Shellac',
      '1 Pedicure simples',
      '10% de desconto em serviços adicionais'
    ],
    destaque: false
  },
  {
    id: 'balance',
    name: 'Plano Balance',
    description: 'Autocuidado completo',
    precoFidelidade: '65€',
    precoSemFidelidade: '70€',
    icon: Crown,
    beneficios: [
      '1 Tratamento de unhas em gel',
      '1 Pedicure com Shellac',
      '1 Design de sobrancelhas',
      'Até 2 reparos de unhas',
      '10% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    destaque: true
  },
  {
    id: 'premium',
    name: 'Plano Premium',
    description: 'Experiência VIP',
    precoFidelidade: '115€',
    precoSemFidelidade: '130€',
    icon: Sparkles,
    beneficios: [
      '1 Spa pedicure com Shellac',
      '1 Tratamento de unhas em gel',
      '1 Limpeza facial',
      '1 Design de sobrancelhas',
      'Reparos ilimitados de unhas',
      '15% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    destaque: false
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
    <section id="planos" className="py-24 bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1]">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.id}
                className="plan-card opacity-0 transform translate-y-8"
              >
                <div 
                  className={`relative p-8 h-full rounded-3xl transition-all duration-300 bg-white/90 backdrop-blur-sm border ${
                    service.destaque
                      ? 'border-[#FF69B4] shadow-xl hover:shadow-2xl scale-105'
                      : 'border-[#FFC0CB] shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {service.destaque && (
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                      <div className="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white text-sm font-semibold shadow-lg">
                        <Crown className="w-4 h-4 mr-2" />
                        Mais Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br from-[#FFB6C1] to-[#FFE4E1]">
                      <Icon className={`w-8 h-8 ${service.destaque ? 'text-[#FF69B4]' : 'text-[#FFB6C1]'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>

                  {/* Preços e Botões */}
                  <div className="space-y-4">
                    {/* Com Fidelização */}
                    <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium">Com Fidelização</p>
                          <p className="text-xs">(3 ou 6 meses)</p>
                        </div>
                        <div className="bg-white/20 rounded-full px-3 py-1">
                          <p className="text-xs">Economia!</p>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-center mb-4">
                        <span className="text-3xl font-bold">{service.precoFidelidade}</span>
                        <span className="ml-1 text-sm">/mês</span>
                      </div>
                      <Link
                        href={`/pagamento?plano=${encodeURIComponent(service.name)}&valor=${encodeURIComponent(service.precoFidelidade)}&tipo=fidelidade`}
                        className="block w-full py-2 px-4 bg-white text-gray-900 rounded-full font-medium border-2 border-[#FFB6C1] hover:bg-gradient-to-r hover:from-[#FFE4E1] hover:to-[#FFF0F5] hover:border-[#FF69B4] hover:text-gray-900 hover:scale-105 transform transition-all duration-300 text-center shadow-sm hover:shadow-md"
                      >
                        Escolher Com Fidelização
                      </Link>
                    </div>

                    {/* Sem Fidelização */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#FFB6C1] transform hover:scale-105 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Sem Fidelização</p>
                          <p className="text-xs text-gray-500">Maior flexibilidade</p>
                        </div>
                      </div>
                      <div className="flex items-baseline justify-center mb-4">
                        <span className="text-3xl font-bold text-gray-800">{service.precoSemFidelidade}</span>
                        <span className="ml-1 text-sm text-gray-600">/mês</span>
                      </div>
                      <Link
                        href={`/pagamento?plano=${encodeURIComponent(service.name)}&valor=${encodeURIComponent(service.precoSemFidelidade)}&tipo=sem_fidelidade`}
                        className="block w-full py-2 px-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full font-medium hover:opacity-90 transition-all duration-300 text-center"
                      >
                        Escolher Sem Fidelização
                      </Link>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                    <TermsAndConditions />
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