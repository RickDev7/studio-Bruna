'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatarData, formatarDataBanco } from '../../../utils/formatters'
import { useAppointment } from '@/hooks/useAppointment'

export default function NovoAgendamentoPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFC0CB] via-white to-[#FFE4E1] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent mb-4">
            Novo Agendamento
          </h1>
          <p className="text-gray-600 text-lg">
            Crie um novo agendamento para um cliente
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seleção de Serviço */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Serviço</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Manicure', 'Pedicure', 'Design de Sobrancelhas', 'Limpeza de Pele'].map(service => (
                <button
                  type="button"
                  key={service}
                  onClick={() => setSelectedService(service)}
                  className={`
                    p-4 rounded-lg text-center transition-colors duration-200
                    ${selectedService === service
                      ? 'bg-[#FF69B4] text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-pink-50'}
                  `}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>

          {/* Seleção de Data e Hora */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data e Hora</h3>
            <Calendar selectedDate={date} onDateSelect={setDate} />
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-700 mb-3">Horários</h4>
              <div className="grid grid-cols-4 gap-2">
                {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
                  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'].map(time => (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`
                      p-2 rounded-lg text-sm font-medium transition-colors duration-200
                      ${selectedTime === time
                        ? 'bg-[#FF69B4] text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-pink-50'}
                    `}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informações do Cliente</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  required
                />
              </div>

              <div>
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FF69B4] focus:ring-[#FF69B4]"
                  required
                />
              </div>
            </div>
          </div>

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
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-[#FFB6C1] to-[#FF69B4] text-white rounded-full hover:opacity-90 transition-opacity duration-300 flex items-center"
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
    </div>
  )
} 