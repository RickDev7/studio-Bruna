'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatarData, formatarDataBanco } from '../../../utils/formatters'
import { useAppointment } from '@/hooks/useAppointment'
import { ServiceSelector } from '@/components/admin/ServiceSelector'
import { TimeSelector } from '@/components/admin/TimeSelector'
import { ClientForm } from '@/components/admin/ClientForm'
import { BookingSteps } from '@/components/admin/BookingSteps'

export default function NovoAgendamentoPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [date, setDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const router = useRouter()
  
  const { createAppointment, isLoading, error } = useAppointment({
    onSuccess: () => {
      toast.success('Agendamento criado com sucesso!')
      router.push('/admin')
    },
    onError: (error) => {
      toast.error(error)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !selectedTime || !clientName || !clientEmail || !clientPhone) {
      toast.error('Por favor, preencha todos os campos')
      return
    }

    try {
      await createAppointment({
        service: selectedService,
        date: formatarDataBanco(date),
        time: selectedTime,
        notes: '',
        user_name: clientName,
        user_email: clientEmail,
        user_phone: clientPhone
      })
    } catch (err) {
      console.error('Erro ao criar agendamento:', err)
    }
  }

  // Atualiza o passo atual baseado nas seleções
  const updateCurrentStep = () => {
    if (!selectedService) return 0;
    if (!date) return 1;
    if (!selectedTime) return 2;
    return 3;
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Novo Agendamento"
    >
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Novo Agendamento
          </h1>
          <p className="text-gray-600 text-lg">
            Crie um novo agendamento para um cliente
          </p>
        </header>

        <BookingSteps currentStep={currentStep} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seleção de Serviço */}
          <section 
            className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${currentStep === 0 ? 'ring-2 ring-[#FF69B4] ring-opacity-50' : ''}`}
            aria-label="Seleção de Serviço"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Serviço</h3>
            <ServiceSelector
              selectedService={selectedService}
              onServiceSelect={(service) => {
                setSelectedService(service);
                setCurrentStep(1);
              }}
            />
          </section>

          {/* Seleção de Data e Hora */}
          <section 
            className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${currentStep === 1 || currentStep === 2 ? 'ring-2 ring-[#FF69B4] ring-opacity-50' : ''}`}
            aria-label="Seleção de Data e Hora"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data e Hora</h3>
            <div className="space-y-6">
              <Calendar 
                selectedDate={date} 
                onDateSelect={(newDate) => {
                  setDate(newDate);
                  setCurrentStep(2);
                }}
              />
              
              <TimeSelector
                selectedTime={selectedTime}
                onTimeSelect={(time) => {
                  setSelectedTime(time);
                  setCurrentStep(3);
                }}
              />
            </div>
          </section>

          {/* Informações do Cliente */}
          <section 
            className={`bg-white p-6 rounded-xl shadow-sm transition-all duration-300 ${currentStep === 3 ? 'ring-2 ring-[#FF69B4] ring-opacity-50' : ''}`}
            aria-label="Informações do Cliente"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informações do Cliente</h3>
            <ClientForm
              clientName={clientName}
              clientEmail={clientEmail}
              clientPhone={clientPhone}
              onNameChange={setClientName}
              onEmailChange={setClientEmail}
              onPhoneChange={setClientPhone}
            />
          </section>

          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-3 border border-[#FFB6C1] text-[#FF69B4] rounded-full hover:bg-pink-50 transition-colors duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedService || !selectedTime || !clientName || !clientEmail || !clientPhone}
              className={`
                px-8 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full
                transition-all duration-300 flex items-center gap-2
                ${(!selectedService || !selectedTime || !clientName || !clientEmail || !clientPhone)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:opacity-90'}
              `}
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
      </div>
    </main>
  )
} 