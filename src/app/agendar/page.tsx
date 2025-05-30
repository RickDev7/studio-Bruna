'use client'

import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '@/config/emailjs';
import { Calendar } from '@/components/Calendar';
import { TimeSlots } from '@/components/TimeSlots';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

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

// Função para formatar a data para o banco de dados
function formatarDataBanco(data: Date): string {
  const year = data.getFullYear();
  const month = String(data.getMonth() + 1).padStart(2, '0');
  const day = String(data.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type EmailParams = {
  to_name: string
  to_email: string
  service: string
  date: string
  time: string
}

type ClientEmailParams = EmailParams & {
  business_name: string
  business_address: string
  business_phone: string
}

type AdminEmailParams = EmailParams & {
  to_email: string
  from_name: string
  client_name: string
  client_email: string
  client_phone: string
}

export default function AgendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

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

  const serviceCategories = [
    {
      name: 'Unhas',
      services: [
        'Manicure com Shellac',
        'Pedicure com Shellac',
        'Spa Pedicure',
        'Unhas em gel',
        'Reparos de unhas'
      ]
    },
    {
      name: 'Tratamentos Faciais',
      services: [
        'Limpeza facial',
        'Tratamento anti-idade',
        'Hidratação facial',
        'Microagulhamento',
        'Máscaras faciais'
      ]
    },
    {
      name: 'Design e Embelezamento',
      services: [
        'Design de sobrancelhas',
        'Coloração de sobrancelhas',
        'Brow lamination',
        'Lifting de pestanas'
      ]
    }
  ];

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
      const dataBanco = formatarDataBanco(date)
      
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      // Salvar o agendamento no Supabase
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service: selectedService,
          date: dataBanco,
          time: selectedTime,
          notes: `Nome: ${name}\nTelefone: ${phone}\nEmail: ${email}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta:', data);
        throw new Error(data.error || 'Erro ao criar agendamento');
      }

      console.log('Resposta do servidor:', data);
      
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

      console.log('Enviando email com os parâmetros:', {
        serviceId: emailjsConfig.serviceId,
        templateIds: emailjsConfig.templates,
        clientParams,
        adminParams
      })

      // Enviar emails
      await Promise.all([
        emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.clientConfirmation,
          clientParams
        ),
        emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templates.adminNotification,
          adminParams
        )
      ])

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        router.push('/')
      }, 3000)

      // Limpar formulário
      setSelectedTime('')
      setSelectedService('')
      setName('')
      setPhone('')
      setEmail('')
      setCurrentStep(1)
    } catch (err: any) {
      console.error('Erro:', err)
      setError(err.message || 'Ocorreu um erro ao agendar. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    setError('');

    if (currentStep === 1 && !selectedService) {
      setError('Por favor, selecione um serviço');
      return;
    }
    if (currentStep === 2 && !selectedTime) {
      setError('Por favor, selecione um horário');
      return;
    }
    if (currentStep === 3) {
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Agendar Horário
          </h1>
          <p className="text-gray-600 text-lg">
            Escolha o serviço e horário de sua preferência
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {showSuccess && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
              Agendamento realizado com sucesso! Em breve você receberá um email de confirmação.
            </div>
          )}

          {/* Indicador de Progresso */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center ${step < 3 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? 'bg-[#FF69B4] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      step < currentStep ? 'bg-[#FF69B4]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Passo 1: Seleção de Serviço */}
          {currentStep === 1 && (
            <div className="space-y-8">
              {serviceCategories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#FF69B4]">{category.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.services.map(service => (
                      <button
                        key={service}
                        onClick={() => setSelectedService(service)}
                        className={`
                          group relative p-6 rounded-xl transition-all duration-300 border
                          ${selectedService === service 
                            ? 'bg-pink-50 border-pink-200 text-gray-800 shadow-md' 
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
              ))}
            </div>
          )}

          {/* Passo 2: Seleção de Data e Hora */}
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

          {/* Passo 3: Informações Pessoais */}
          {currentStep === 3 && (
            <form id="agendamentoForm" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4] bg-white/50"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4] bg-white/50"
                  placeholder="Digite seu email"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4] bg-white/50"
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
            </form>
          )}

          {/* Botões de Navegação */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                type="button"
                className="px-6 py-3 border border-[#FFB6C1] text-[#FF69B4] rounded-full hover:bg-pink-50 transition-colors duration-300"
              >
                Voltar
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                type="button"
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300"
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
    </div>
  );
} 