'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { TimeSlots } from '@/components/TimeSlots'

// Função auxiliar para formatar a data
function formatarData(data: Date): string {
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const diaDaSemana = diasDaSemana[data.getDay()]
  
  return `${diaDaSemana}, ${data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })}`
}

export function Scheduling() {
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

  const services = [
    'Manicure',
    'Pedicure',
    'Design de Unhas',
    'Limpeza de Pele',
    'Lifting de Cílios',
    'Lifting de Sobrancelhas',
    'Hidratação Labial',
    'Técnica com Fio'
  ]

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
      const dataFormatada = formatarData(date)
      
      // Enviar email de confirmação
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: name,
          userEmail: email,
          service: selectedService,
          date: dataFormatada,
          time: selectedTime,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar email de confirmação');
      }

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Limpar formulário
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
      setCurrentStep(1)
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
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          Agendamento realizado com sucesso! Em breve você receberá um email de confirmação.
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(service => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`
                  group relative p-6 rounded-xl transition-all duration-300 border
                  ${selectedService === service 
                    ? 'bg-pink-50 border-pink-200 text-gray-800' 
                    : 'bg-white border-pink-50 hover:border-pink-200 text-gray-600 hover:bg-pink-50/50'}
                `}
              >
                <span className="text-lg font-light">{service}</span>
                {selectedService === service && (
                  <svg className="absolute top-4 right-4 w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
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
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={prevStep}
              className="px-6 py-3 rounded-full border border-pink-200 text-gray-700 hover:bg-pink-50 transition-all duration-300"
            >
              Voltar
            </button>
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
          </div>
        </form>
      )}

      {currentStep < 3 && (
        <div className="flex justify-between pt-6">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="px-6 py-3 rounded-full border border-pink-200 text-gray-700 hover:bg-pink-50 transition-all duration-300"
            >
              Voltar
            </button>
          )}
          <button
            onClick={nextStep}
            className="ml-auto px-6 py-3 rounded-lg bg-pink-50 text-gray-800 border border-pink-200 hover:bg-pink-100 transition-all duration-300"
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  )
} 