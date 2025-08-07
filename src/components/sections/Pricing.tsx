'use client'

import { Star, Check, Copy, AlertCircle, Phone, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { DetalhesPlanoModal } from '@/components/DetalhesPlanoModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/data/translations'

const planos = [
  {
    id: 'basico',
    nome: (lang: string) => {
      if (lang === 'de') return 'Grundplan'
      if (lang === 'en') return 'Essential Plan'
      if (lang === 'es') return 'Plan Esencial'
      return 'Plano Essencial'
    },
    subtitulo: (lang: string) => {
      if (lang === 'de') return 'Monatliche Grundpflege'
      if (lang === 'en') return 'Monthly basic care'
      if (lang === 'es') return 'Cuidados básicos mensuales'
      return 'Cuidados básicos mensais'
    },
    descricao: (lang: string) => {
      if (lang === 'de') return 'Monatliche Grundpflege, um Ihre Nägel immer schön und gesund zu halten.'
      if (lang === 'en') return 'Monthly basic care to keep your nails always beautiful and healthy.'
      if (lang === 'es') return 'Cuidados básicos mensuales para mantener tus uñas siempre hermosas y saludables.'
      return 'Cuidados básicos mensais para manter suas unhas sempre bonitas e saudáveis.'
    },
    precoFidelidade: '40€',
    precoSemFidelidade: '45€',
    beneficios: (lang: string) => {
      if (lang === 'de') return [
        '1 Maniküre mit Shellac',
        '1 einfache Pediküre',
        '10% Rabatt auf zusätzliche Dienstleistungen'
      ]
      if (lang === 'en') return [
        '1 Manicure with Shellac',
        '1 Simple Pedicure',
        '10% discount on additional services'
      ]
      if (lang === 'es') return [
        '1 Manicura con Shellac',
        '1 Pedicura simple',
        '10% de descuento en servicios adicionales'
      ]
      return [
        '1 Manicure com Shellac',
        '1 Pedicure simples',
        '10% de desconto em serviços adicionais'
      ]
    },
    imagem: '/images/plano-basico.png'
  },
  {
    id: 'balance',
    nome: (lang: string) => {
      if (lang === 'de') return 'Balance-Plan'
      if (lang === 'en') return 'Balance Plan'
      if (lang === 'es') return 'Plan Equilibrio'
      return 'Plano Equilíbrio'
    },
    subtitulo: (lang: string) => {
      if (lang === 'de') return 'Vollständige Selbstpflege'
      if (lang === 'en') return 'Complete self-care'
      if (lang === 'es') return 'Autocuidado completo'
      return 'Autocuidado completo'
    },
    descricao: (lang: string) => {
      if (lang === 'de') return 'Vollständige Selbstpflege mit Premium-Dienstleistungen für Ihre Schönheit und Ihr Wohlbefinden.'
      if (lang === 'en') return 'Complete self-care with premium services for your beauty and well-being.'
      if (lang === 'es') return 'Autocuidado completo con servicios premium para tu belleza y bienestar.'
      return 'Autocuidado completo com serviços premium para sua beleza e bem-estar.'
    },
    precoFidelidade: '65€',
    precoSemFidelidade: '70€',
    beneficios: (lang: string) => {
      if (lang === 'de') return [
        '1 Gel-Nagelbehandlung',
        '1 Pediküre mit Shellac',
        '1 Augenbrauen-Design',
        'Bis zu 2 Nagelreparaturen',
        '10% Rabatt auf zusätzliche Dienstleistungen',
        'Priorität bei der Terminbuchung'
      ]
      if (lang === 'en') return [
        '1 Gel nail treatment',
        '1 Pedicure with Shellac',
        '1 Eyebrow design',
        'Up to 2 nail repairs',
        '10% discount on additional services',
        'Priority scheduling'
      ]
      if (lang === 'es') return [
        '1 Tratamiento de uñas en gel',
        '1 Pedicura con Shellac',
        '1 Diseño de cejas',
        'Hasta 2 reparaciones de uñas',
        '10% de descuento en servicios adicionales',
        'Prioridad en el agendamiento'
      ]
      return [
        '1 Tratamento de unhas em gel',
        '1 Pedicure com Shellac',
        '1 Design de sobrancelhas',
        'Até 2 reparos de unhas',
        '10% de desconto em serviços adicionais',
        'Prioridade no agendamento'
      ]
    },
    imagem: '/images/plano-balance.png',
    destaque: true
  },
  {
    id: 'premium',
    nome: (lang: string) => {
      if (lang === 'de') return 'Premium-Plan'
      if (lang === 'en') return 'Premium Plan'
      if (lang === 'es') return 'Plan Premium'
      return 'Plano Premium'
    },
    subtitulo: (lang: string) => {
      if (lang === 'de') return 'VIP-Erfahrung'
      if (lang === 'en') return 'VIP Experience'
      if (lang === 'es') return 'Experiencia VIP'
      return 'Experiência VIP'
    },
    descricao: (lang: string) => {
      if (lang === 'de') return 'VIP-Erfahrung mit exklusiven Behandlungen und besonderen Vorteilen.'
      if (lang === 'en') return 'VIP experience with exclusive treatments and special benefits.'
      if (lang === 'es') return 'Experiencia VIP con tratamientos exclusivos y beneficios especiales.'
      return 'Experiência VIP com tratamentos exclusivos e benefícios especiais.'
    },
    precoFidelidade: '115€',
    precoSemFidelidade: '130€',
    beneficios: (lang: string) => {
      if (lang === 'de') return [
        '1 Spa-Pediküre mit Shellac',
        '1 Gel-Nagelbehandlung',
        '1 Gesichtsreinigung',
        '1 Augenbrauen-Design',
        'Unbegrenzte Nagelreparaturen',
        '15% Rabatt auf zusätzliche Dienstleistungen',
        'Priorität bei der Terminbuchung'
      ]
      if (lang === 'en') return [
        '1 Spa pedicure with Shellac',
        '1 Gel nail treatment',
        '1 Facial cleansing',
        '1 Eyebrow design',
        'Unlimited nail repairs',
        '15% discount on additional services',
        'Priority scheduling'
      ]
      if (lang === 'es') return [
        '1 Spa pedicura con Shellac',
        '1 Tratamiento de uñas en gel',
        '1 Limpieza facial',
        '1 Diseño de cejas',
        'Reparaciones ilimitadas de uñas',
        '15% de descuento en servicios adicionales',
        'Prioridad en el agendamiento'
      ]
      return [
        '1 Spa pedicure com Shellac',
        '1 Tratamento de unhas em gel',
        '1 Limpeza facial',
        '1 Design de sobrancelhas',
        'Reparos ilimitados de unhas',
        '15% de desconto em serviços adicionais',
        'Prioridade no agendamento'
      ]
    },
    imagem: '/images/plano-premium.png'
  }
]

interface PlanoSelecionadoType {
  nome: string
  valor: string
  tipo: 'fidelidade' | 'sem_fidelidade'
}

export function Pricing() {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [planoSelecionado, setPlanoSelecionado] = useState<typeof planos[0] | null>(null)
  const [modalAberto, setModalAberto] = useState(false)
  const [finalizacaoAberta, setFinalizacaoAberta] = useState(false)
  const [planoFinalizacao, setPlanoFinalizacao] = useState<PlanoSelecionadoType | null>(null)
  const [termosModalAberto, setTermosModalAberto] = useState(false)

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
            {t('pricing.title')}
          </span>
          <h2 className="mt-2 text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
            {t('pricing.subtitle')}
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.description')}
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
                    {language === 'de' ? 'Am Beliebtesten' : 
                     language === 'en' ? 'Most Popular' : 
                     language === 'es' ? 'Más Popular' : 'Mais Popular'}
                  </div>
                )}

                {/* Imagem do Plano */}
                <div className="relative mb-8 transform group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative h-[200px] w-full rounded-2xl overflow-hidden">
                    <Image
                      src={plano.imagem}
                      alt={typeof plano.nome === 'function' ? plano.nome(language) : plano.nome}
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
                  {typeof plano.nome === 'function' ? plano.nome(language) : plano.nome}
                </h3>
                <p className="mt-2 text-gray-600">{typeof plano.subtitulo === 'function' ? plano.subtitulo(language) : plano.subtitulo}</p>

                {/* Preços */}
                <div className="mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] p-6 rounded-2xl text-white">
                    <p className="text-sm font-medium mb-2">{t('pricing.loyalty')}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold">{plano.precoFidelidade}</span>
                      <span className="ml-1 text-sm">{t('common.perMonth')}</span>
                    </div>
                  </div>

                  <div className="bg-pink-50 p-6 rounded-2xl">
                    <p className="text-sm font-medium text-gray-800 mb-2">{t('pricing.noLoyalty')}</p>
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-800">{plano.precoSemFidelidade}</span>
                      <span className="ml-1 text-sm text-gray-600">{t('common.perMonth')}</span>
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    {language === 'de' ? 'Inklusive Vorteile' : 
                     language === 'en' ? 'Included Benefits' : 
                     language === 'es' ? 'Beneficios Incluidos' : 'Benefícios Inclusos'}
                  </h4>
                  <ul className="space-y-3">
                    {(typeof plano.beneficios === 'function' ? plano.beneficios(language) : plano.beneficios).map((beneficio, idx) => (
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
                        nome: typeof plano.nome === 'function' ? plano.nome(language) : plano.nome,
                        valor: plano.precoFidelidade,
                        tipo: 'fidelidade'
                      })
                      setFinalizacaoAberta(true)
                    }}
                    className="block w-full py-3 px-4 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full font-medium text-center hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                  >
                    {language === 'de' ? 'Mit Treueprogramm wählen' : 
                     language === 'en' ? 'Choose With Loyalty' : 
                     language === 'es' ? 'Elegir Con Fidelidad' : 'Escolher Com Fidelização'}
                  </button>
                  
                  <button
                    onClick={() => {
                      setPlanoFinalizacao({
                        nome: typeof plano.nome === 'function' ? plano.nome(language) : plano.nome,
                        valor: plano.precoSemFidelidade,
                        tipo: 'sem_fidelidade'
                      })
                      setFinalizacaoAberta(true)
                    }}
                    className="block w-full py-3 px-4 bg-white text-[#FF69B4] rounded-full font-medium border-2 border-[#FFB6C1] text-center hover:border-[#FF69B4] transition-all duration-300 transform hover:scale-105"
                  >
                    {language === 'de' ? 'Ohne Treueprogramm wählen' : 
                     language === 'en' ? 'Choose Without Loyalty' : 
                     language === 'es' ? 'Elegir Sin Fidelidad' : 'Escolher Sem Fidelização'}
                  </button>
                </div>



                {/* Termos e Condições */}
                <div className="mt-3 text-center">
                  <button
                    onClick={() => {
                      setTermosModalAberto(true)
                    }}
                    className="inline-flex items-center text-[#FF69B4] hover:text-[#FF1493] transition-colors duration-300 group/terms text-sm"
                  >
                    <span className="border-b border-transparent group-hover/terms:border-[#FF1493]">
                      {language === 'de' ? 'Nutzungsbedingungen anzeigen' : 
                       language === 'en' ? 'View Terms & Conditions' : 
                       language === 'es' ? 'Ver Términos y Condiciones' : 'Ver Termos e Condições'}
                    </span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 transform group-hover/terms:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
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
                      {language === 'de' ? 'Mehr über diesen Plan erfahren' : 
                       language === 'en' ? 'Learn more about this plan' : 
                       language === 'es' ? 'Saber más sobre este plan' : 'Saiba mais sobre este plano'}
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
      {planoSelecionado && modalAberto && (
        <DetalhesPlanoModal
          isOpen={modalAberto}
          onClose={() => {
            setModalAberto(false)
            setPlanoSelecionado(null)
          }}
          plano={{
            nome: typeof planoSelecionado.nome === 'function' ? planoSelecionado.nome(language) : planoSelecionado.nome,
            descricao: typeof planoSelecionado.descricao === 'function' ? planoSelecionado.descricao(language) : planoSelecionado.descricao,
            imagem: planoSelecionado.imagem,
            beneficios: typeof planoSelecionado.beneficios === 'function' ? planoSelecionado.beneficios(language) : planoSelecionado.beneficios,
            precoFidelidade: planoSelecionado.precoFidelidade,
            precoSemFidelidade: planoSelecionado.precoSemFidelidade
          }}
        />
      )}

      {/* Modal de Finalização */}
      {planoFinalizacao && (
        <div
          id="finalizacao-modal"
          className={`fixed inset-0 bg-black bg-opacity-50 z-[9997] flex items-center justify-center p-4 ${
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
                {t('payment.title')}
              </h2>
              <p className="text-gray-600 mb-8">
                {t('payment.description')}
              </p>

              {/* Plano Selecionado */}
              <div className="bg-gradient-to-r from-[#FFB6C1] to-[#FFC0CB] p-6 rounded-2xl text-white mb-8">
                <h3 className="text-lg font-medium mb-2">{t('payment.selectedPlan')}</h3>
                <p className="text-2xl font-bold mb-2">{planoFinalizacao.nome}</p>
                <p className="text-lg">
                  {planoFinalizacao.tipo === 'fidelidade' ? t('payment.withLoyalty') : t('payment.withoutLoyalty')}
                </p>
                <p className="text-3xl font-bold mt-4">{planoFinalizacao.valor}{t('common.perMonth')}</p>
              </div>

              {/* Dados Bancários */}
              <div className="space-y-4">
                {[
                  { label: t('payment.bank'), value: 'N26 Bank' },
                  { label: t('payment.name'), value: 'BRUNA RAFAELA PEREIRA DA SILVA' },
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('payment.important')}</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-3">
                      {translations[language].payment.importantItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <div className="mt-6 bg-white p-4 rounded-lg border border-[#FFB6C1]">
                      <p className="flex items-center text-gray-700">
                        <Phone className="w-5 h-5 text-[#FF69B4] mr-3" />
                        {t('payment.sendReceipt')}{' '}
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
                  {t('payment.backToPlans')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Termos e Condições */}
      {termosModalAberto && (
        <div
          id="termos-modal"
          className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
          onClick={() => setTermosModalAberto(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === 'de' ? 'Nutzungsbedingungen' : 
                 language === 'en' ? 'Terms & Conditions' : 
                 language === 'es' ? 'Términos y Condiciones' : 'Termos e Condições'}
              </h2>
              <button
                onClick={() => setTermosModalAberto(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-4">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '1. Treueprogramme' : 
                   language === 'en' ? '1. Loyalty Programs' : 
                   language === 'es' ? '1. Programas de Fidelización' : '1. Planos de Fidelização'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Die Treueprogramme haben eine Mindestlaufzeit von 3 oder 6 Monaten mit monatlicher Zahlung. Der Kunde verpflichtet sich, den Plan für den gewählten Zeitraum beizubehalten.' : 
                   language === 'en' ? 'Loyalty programs have a minimum duration of 3 or 6 months with monthly payment. The customer commits to maintaining the plan for the chosen period.' : 
                   language === 'es' ? 'Los programas de fidelización tienen una duración mínima de 3 o 6 meses con pago mensual. El cliente se compromete a mantener el plan durante el período elegido.' : 
                   'Os planos de fidelização têm duração mínima de 3 ou 6 meses, com pagamento mensal. O cliente se compromete a manter o plano pelo período escolhido.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '2. Kündigung' : 
                   language === 'en' ? '2. Cancellation' : 
                   language === 'es' ? '2. Cancelación' : '2. Cancelamento'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Für Pläne ohne Treueprogramm kann die Kündigung jederzeit mit 30 Tagen Vorankündigung erfolgen. Für Pläne mit Treueprogramm kann eine Kündigung vor Ablauf der vertraglich vereinbarten Zeit zu einer Strafe führen.' : 
                   language === 'en' ? 'For plans without loyalty programs, cancellation can be done at any time with 30 days notice. For plans with loyalty programs, cancellation before the end of the contractually agreed time may result in a penalty.' : 
                   language === 'es' ? 'Para planes sin programa de fidelización, la cancelación puede realizarse en cualquier momento con 30 días de aviso. Para planes con programa de fidelización, la cancelación antes del vencimiento del tiempo acordado contractualmente puede resultar en una penalización.' : 
                   'Para planos sem fidelização, o cancelamento pode ser feito a qualquer momento, com aviso prévio de 30 dias. Para planos com fidelização, o cancelamento antes do término do período contratado pode implicar em multa.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '3. Terminbuchungen' : 
                   language === 'en' ? '3. Appointment Bookings' : 
                   language === 'es' ? '3. Reservas de Citas' : '3. Agendamentos'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Die im Plan enthaltenen Dienstleistungen müssen mindestens 24 Stunden im Voraus gebucht werden. Das Nichterscheinen ohne 24-stündige Vorankündigung führt zum Verlust der Dienstleistung des Monats.' : 
                   language === 'en' ? 'Services included in the plan must be booked at least 24 hours in advance. No-show without 24-hour notice results in the loss of the month\'s service.' : 
                   language === 'es' ? 'Los servicios incluidos en el plan deben reservarse con al menos 24 horas de anticipación. La no presentación sin aviso de 24 horas resulta en la pérdida del servicio del mes.' : 
                   'Os serviços inclusos no plano devem ser agendados com antecedência mínima de 24 horas. O não comparecimento sem aviso prévio de 24 horas implica na perda do serviço do mês.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '4. Vorteile' : 
                   language === 'en' ? '4. Benefits' : 
                   language === 'es' ? '4. Beneficios' : '4. Benefícios'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Die Rabatte und Vorteile sind persönlich und nicht übertragbar. Die im Plan enthaltenen Dienstleistungen sind nicht kumulativ und müssen innerhalb des laufenden Monats genutzt werden.' : 
                   language === 'en' ? 'Discounts and benefits are personal and non-transferable. Services included in the plan are not cumulative and must be used within the current month.' : 
                   language === 'es' ? 'Los descuentos y beneficios son personales y no transferibles. Los servicios incluidos en el plan no son acumulativos y deben utilizarse dentro del mes en curso.' : 
                   'Os descontos e benefícios são pessoais e intransferíveis. Os serviços inclusos no plano não são cumulativos e devem ser utilizados dentro do mês vigente.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '5. Zahlung' : 
                   language === 'en' ? '5. Payment' : 
                   language === 'es' ? '5. Pago' : '5. Pagamento'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Die Zahlung erfolgt monatlich und muss bis zum bei der Beauftragung gewählten Tag erfolgen. Die Nichtzahlung kann zur Aussetzung der Dienstleistungen bis zur Regularisierung führen.' : 
                   language === 'en' ? 'Payment is made monthly and must be made by the day chosen at the time of contracting. Non-payment may result in suspension of services until regularization.' : 
                   language === 'es' ? 'El pago se realiza mensualmente y debe realizarse hasta el día elegido al momento de la contratación. El no pago puede resultar en la suspensión de servicios hasta la regularización.' : 
                   'O pagamento é mensal e deve ser efetuado até o dia escolhido no momento da contratação. O não pagamento pode resultar na suspensão dos serviços até a regularização.'}
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'de' ? '6. Anpassungen' : 
                   language === 'en' ? '6. Adjustments' : 
                   language === 'es' ? '6. Ajustes' : '6. Reajustes'}
                </h3>
                <p className="text-gray-600">
                  {language === 'de' ? 'Die Planwerte können jährlich mit 30 Tagen Vorankündigung angepasst werden. Für Pläne mit Treueprogramm bleibt der Wert während der vertraglich vereinbarten Zeit fest.' : 
                   language === 'en' ? 'Plan values can be adjusted annually with 30 days notice. For plans with loyalty programs, the value remains fixed during the contractually agreed time.' : 
                   language === 'es' ? 'Los valores del plan pueden ajustarse anualmente con 30 días de aviso. Para planes con programa de fidelización, el valor permanece fijo durante el tiempo acordado contractualmente.' : 
                   'Os valores dos planos podem ser reajustados anualmente, com aviso prévio de 30 dias. Para planos com fidelização, o valor permanece fixo durante o período contratado.'}
                </p>
              </section>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100">
              <button
                onClick={() => setTermosModalAberto(false)}
                className="w-full py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
              >
                {language === 'de' ? 'Schließen' : 
                 language === 'en' ? 'Close' : 
                 language === 'es' ? 'Cerrar' : 'Fechar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 