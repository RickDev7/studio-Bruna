'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '@/config/emailjs'
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

// Tipos para os parâmetros dos emails
interface EmailParams extends Record<string, unknown> {
  to_name: string;
  to_email: string;
  service: string;
  date: string;
  time: string;
}

interface ClientEmailParams extends EmailParams {
  business_name: string;
  business_address: string;
  business_phone: string;
}

interface AdminEmailParams extends EmailParams {
  from_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
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

  // Inicializar EmailJS
  useEffect(() => {
    try {
      emailjs.init(emailjsConfig.publicKey)
      console.log('EmailJS inicializado com sucesso')
    } catch (err) {
      console.error('Erro ao inicializar EmailJS:', err)
      setError('Erro ao inicializar o sistema de emails. Por favor, recarregue a página.')
    }
  }, [])

  const services = [
    'Manicure',
    'Pedicure',
    'Design de Unhas',
    'Limpeza de Pele',
    'Lifting de Cílios',
    'Lifting de Sobrancelhas',
    'Hidratação Labial',
    'Técnica com Fio',
    'Depilação com Cera'
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
      
      // Parâmetros base para os emails
      const baseParams: EmailParams = {
        to_name: name,
        to_email: email,
        service: selectedService,
        date: dataFormatada,
        time: selectedTime
      }

      // Parâmetros para o email do cliente
      const clientParams: ClientEmailParams = {
        ...baseParams,
        business_name: emailjsConfig.businessInfo.name,
        business_address: emailjsConfig.businessInfo.address,
        business_phone: emailjsConfig.businessInfo.phone
      }

      // Parâmetros para o email do admin
      const adminParams: AdminEmailParams = {
        ...baseParams,
        to_email: emailjsConfig.adminEmail,
        from_name: name,
        client_name: name,
        client_email: email,
        client_phone: phone
      }

      // Enviar emails
      await Promise.all([
        emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.clientConfirmation,
          clientParams,
          emailjsConfig.publicKey
        ),
        emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.adminNotification,
          adminParams,
          emailjsConfig.publicKey
        )
      ])

      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)

      // Limpar formulário
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
      setCurrentStep(1)
    } catch (err: any) {
      console.error('Erro ao enviar emails:', err)
      setError(err.message || 'Ocorreu um erro ao agendar. Por favor, tente novamente.')
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
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50/30">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header com estilo delicado */}
        <div className="text-center mb-16 pt-16">
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            <span className="block">Agende seu</span>
            <span className="block text-pink-300">Momento de Beleza</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-[1px] bg-pink-200"></div>
            <div className="w-2 h-2 rounded-full bg-pink-200"></div>
            <div className="w-12 h-[1px] bg-pink-200"></div>
          </div>
          <p className="text-gray-600 font-light">Cuide-se com quem entende de beleza</p>
        </div>

        {/* Progress Steps com estilo suave */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute left-0 top-1/2 w-full h-[1px] bg-pink-100"></div>
            <div 
              className="absolute left-0 top-1/2 h-[1px] bg-pink-200 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            ></div>
            <div className="relative flex justify-between">
              {['Serviço', 'Horário', 'Seus Dados'].map((step, index) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    text-base transition-all duration-300 border
                    ${currentStep > index + 1 
                      ? 'bg-pink-100 border-pink-200 text-pink-400' 
                      : currentStep === index + 1 
                        ? 'bg-white border-pink-200 text-pink-400' 
                        : 'bg-white border-pink-100 text-gray-400'}
                  `}>
                    {index + 1}
                  </div>
                  <span className={`
                    mt-3 text-sm transition-all duration-300
                    ${currentStep > index + 1 
                      ? 'text-pink-400' 
                      : currentStep === index + 1 
                        ? 'text-gray-800' 
                        : 'text-gray-400'}
                  `}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mensagens de Feedback com estilo suave */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-red-50/50 border border-red-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
                <p className="text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-green-50/50 border border-green-100 p-4 rounded-lg">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-300 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <p className="text-green-600">
                  Agendamento realizado com sucesso! Em breve você receberá um email de confirmação.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Principal com estilo suave */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-pink-100 p-8">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-800 mb-2">Escolha seu Serviço</h2>
                  <p className="text-gray-600 font-light">Selecione o serviço que você deseja agendar</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map(service => (
                    <button
                      key={service}
                      onClick={() => setSelectedService(service)}
                      className={`
                        group relative p-6 rounded-xl transition-all duration-300
                        border hover:shadow-sm
                        ${selectedService === service 
                          ? 'bg-pink-50 border-pink-200 text-gray-800' 
                          : 'bg-white border-pink-50 hover:border-pink-200 text-gray-600 hover:bg-pink-50/50'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-light">{service}</span>
                        <span className={`
                          transition-all duration-300
                          ${selectedService === service ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                        `}>
                          <svg className="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-800 mb-2">Escolha a Data e Horário</h2>
                  <p className="text-gray-600 font-light">Selecione quando você deseja ser atendido(a)</p>
                </div>
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
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-800 mb-2">Seus Dados</h2>
                  <p className="text-gray-600 font-light">Preencha suas informações para confirmar o agendamento</p>
                </div>
                <div className="max-w-xl mx-auto space-y-6">
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
                      Telefone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-pink-100 focus:ring-2 focus:ring-pink-100 focus:border-pink-200 transition-colors bg-white/50"
                      placeholder="+XX (XX) XXXXX-XXXX"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Navegação com estilo suave */}
            <div className="flex justify-between items-center mt-10 pt-6 border-t border-pink-50">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !selectedService || currentStep === 2 && !selectedTime}
                  className={`
                    flex items-center px-6 py-3 rounded-lg transition-all duration-300 border
                    ${currentStep === 1 && !selectedService || currentStep === 2 && !selectedTime
                      ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      : 'bg-pink-50 text-gray-800 border-pink-200 hover:bg-pink-100'}
                  `}
                >
                  Continuar
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`
                    flex items-center px-6 py-3 rounded-lg transition-all duration-300 border
                    ${isLoading
                      ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      : 'bg-pink-50 text-gray-800 border-pink-200 hover:bg-pink-100'}
                  `}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Agendamento
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 