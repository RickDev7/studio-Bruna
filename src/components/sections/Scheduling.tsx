'use client'

import { useState, useEffect } from 'react'
import emailjs from '@emailjs/browser'
import { emailjsConfig } from '@/config/emailjs'

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

// Horários disponíveis por período
const periodos = {
  manha: [
    { hora: '09:00', disponivel: true },
    { hora: '10:00', disponivel: true },
    { hora: '11:00', disponivel: false },
    { hora: '12:00', disponivel: true }
  ],
  tarde: [
    { hora: '14:00', disponivel: true },
    { hora: '15:00', disponivel: true },
    { hora: '16:00', disponivel: false },
    { hora: '17:00', disponivel: true },
    { hora: '18:00', disponivel: true }
  ]
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

      try {
        // Enviar email para o cliente
        const clientResponse = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.clientConfirmation,
          clientParams,
          emailjsConfig.publicKey
        )

        if (clientResponse.status !== 200) {
          throw new Error('Erro ao enviar email de confirmação')
        }

        // Enviar email para o administrador
        const adminResponse = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.adminNotification,
          adminParams,
          emailjsConfig.publicKey
        )

        if (adminResponse.status !== 200) {
          throw new Error('Erro ao enviar notificação para o administrador')
        }

        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)

        // Limpar formulário
        setSelectedTime('')
        setSelectedService('')
        setName('')
        setPhone('')
        setEmail('')
      } catch (emailError: any) {
        console.error('Erro detalhado do EmailJS:', {
          error: emailError,
          message: emailError.message,
          text: emailError.text,
          details: emailError.details
        })
        throw new Error(
          emailError.text || 
          emailError.message || 
          'Erro ao enviar email. Por favor, tente novamente em alguns minutos.'
        )
      }
    } catch (err: any) {
      console.error('Erro completo:', err)
      const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro ao agendar. Por favor, tente novamente.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <section className="py-24 bg-white" id="agendar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Agendar Horário
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Escolha o serviço, data e horário desejados
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-gradient-to-br from-[#FFC0CB] to-[#FFB6C1]">
                <h3 className="text-2xl font-bold text-white mb-6">Escolha o Horário</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Data</label>
                    <input
                      type="date"
                      min={formatDateForInput(new Date())}
                      value={formatDateForInput(date)}
                      onChange={(e) => setDate(new Date(e.target.value))}
                      className="w-full p-3 rounded-lg bg-white/90 border-0 focus:ring-2 focus:ring-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Horário</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(periodos).map(([periodo, horarios]) => (
                        <div key={periodo}>
                          <h4 className="text-sm font-medium text-white mb-2">
                            {periodo === 'manha' ? 'Manhã' : 'Tarde'}
                          </h4>
                          <div className="space-y-2">
                            {horarios.map((horario) => (
                              <button
                                key={horario.hora}
                                onClick={() => setSelectedTime(horario.hora)}
                                disabled={!horario.disponivel}
                                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all
                                  ${
                                    selectedTime === horario.hora
                                      ? 'bg-white text-[#FFC0CB]'
                                      : horario.disponivel
                                      ? 'bg-white/80 text-gray-700 hover:bg-white'
                                      : 'bg-white/50 text-gray-400 cursor-not-allowed'
                                  }
                                `}
                              >
                                {horario.hora}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Seus Dados</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serviço</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full p-3 rounded-full border-gray-300 focus:ring-[#FFC0CB] focus:border-[#FFC0CB] text-gray-900 bg-white"
                      required
                    >
                      <option value="">Selecione um serviço</option>
                      {services.map((service) => (
                        <option key={service} value={service} className="text-gray-900">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 rounded-full border-gray-300 focus:ring-[#FFC0CB] focus:border-[#FFC0CB] text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-full border-gray-300 focus:ring-[#FFC0CB] focus:border-[#FFC0CB] text-gray-900 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+49 XXX XXXXXXX"
                      className="w-full p-3 rounded-full border-gray-300 focus:ring-[#FFC0CB] focus:border-[#FFC0CB] text-gray-900 bg-white"
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!selectedTime || !selectedService || isLoading}
                    className={`w-full py-3 px-4 rounded-full text-white font-medium transition-all
                      ${
                        !selectedTime || !selectedService || isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#FFC0CB] hover:bg-[#FFB6C1] shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {isLoading ? 'Enviando...' : 'Confirmar Agendamento'}
                  </button>
                </form>

                {showSuccess && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    Agendamento realizado com sucesso! Você receberá um email de confirmação em breve.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 