'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { TimeSlots } from '@/components/TimeSlots'
import { useAppointment } from '@/hooks/useAppointment'
import { formatarData, formatarDataBanco } from '@/utils/formatters'
import { services, Service } from '@/config/services'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function AgendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Service['category']>('nails')

  const { createAppointment } = useAppointment({
    onSuccess: () => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      // Limpar formulário
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
      setCurrentStep(1)
    },
    onError: (error) => {
      setError(error)
    }
  })

  const categories = [
    { id: 'nails', name: 'Unhas' },
    { id: 'face', name: 'Rosto' },
    { id: 'eyebrows', name: 'Sobrancelhas e Cílios' },
    { id: 'lips', name: 'Lábios' }
  ]

  const filteredServices = services.filter(service => service.category === selectedCategory)

  const validateForm = () => {
    if (!selectedService) return 'Por favor, selecione um serviço'
    if (!selectedTime) return 'Por favor, selecione um horário'
    if (!name.trim()) return 'Por favor, informe seu nome'
    if (!email.trim()) return 'Por favor, informe seu email'
    if (!phone.trim()) return 'Por favor, informe seu telefone'
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Por favor, informe um email válido'
    
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    if (!phoneRegex.test(phone)) return 'Por favor, informe um telefone válido no formato internacional'
    
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar formulário
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await createAppointment({
        service: selectedService,
        date: formatarDataBanco(date),
        time: selectedTime,
        notes: '',
        user_name: name,
        user_email: email,
        user_phone: phone
      })
    } catch (error) {
      console.error('Erro:', error)
      setError('Ocorreu um erro ao agendar. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 1 && !selectedService) {
      setError('Por favor, selecione um serviço')
      return
    }
    if (currentStep === 2 && !selectedTime) {
      setError('Por favor, selecione um horário')
      return
    }
    setError('')
    setCurrentStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError('')
    setCurrentStep(prev => prev - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Botão Voltar */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Voltar para a página inicial
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Agendar Serviço
          </h1>
          <p className="text-gray-600 text-lg">
            Escolha o serviço e horário de sua preferência
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6">
            Agendamento realizado com sucesso! Em breve você receberá um email de confirmação.
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Serviço</h3>
            
            {/* Categorias */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as Service['category'])}
                  className={cn(
                    "px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200",
                    selectedCategory === category.id
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-pink-50"
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Lista de Serviços */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={cn(
                    "p-4 rounded-lg text-left transition-all duration-200 border",
                    selectedService === service.id
                      ? "bg-pink-50 border-pink-200"
                      : "bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                  )}
                >
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <Calendar selectedDate={date} onDateSelect={setDate} />
            <div className="mt-8">
              <h3 className="text-xl font-light text-gray-800 mb-4">Horários Disponíveis</h3>
              <TimeSlots
                selectedDate={date}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <form id="agendamentoForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-pink-200 transition-colors bg-white/50"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-pink-200 transition-colors bg-white/50"
                  placeholder="Digite seu email"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-pink-200 transition-colors bg-white/50"
                  placeholder="+49 XXX XXXXXXX"
                />
              </div>

              <div className="bg-pink-50/30 rounded-xl p-6 border border-pink-100">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Resumo do Agendamento</h4>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Serviço:</span> {selectedService}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Data:</span> {formatarData(date)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Horário:</span> {selectedTime}
                  </p>
                  {services.find(s => s.name === selectedService) && (
                    <p className="text-gray-600">
                      <span className="font-medium">Duração:</span> {services.find(s => s.name === selectedService)?.duration}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-full border border-pink-200 text-gray-700 hover:bg-pink-50 transition-all duration-300"
            >
              Voltar
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-3 rounded-lg bg-pink-50 text-gray-800 border border-pink-200 hover:bg-pink-100 transition-all duration-300"
            >
              Próximo
            </button>
          ) : (
            <button
              type="submit"
              form="agendamentoForm"
              disabled={isLoading}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300 flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                'Confirmar Agendamento'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 