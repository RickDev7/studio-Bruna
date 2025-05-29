'use client'

import React from 'react'
import { businessHours, generateTimeSlots } from '@/config/businessHours'
import { SelectedTimeDisplay } from './SelectedTimeDisplay'

interface TimeSlotsProps {
  selectedDate: Date
  selectedTime: string
  onTimeSelect: (time: string) => void
  unavailableSlots?: string[] // Novo prop para horários indisponíveis
}

export function TimeSlots({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect,
  unavailableSlots = [] // Horários já agendados virão do backend
}: TimeSlotsProps) {
  // Obtém a configuração do dia selecionado
  const dayOfWeek = selectedDate.getDay()
  const dayConfig = businessHours[dayOfWeek]

  // Gera os horários disponíveis para o dia
  const timeSlots = generateTimeSlots(dayConfig)

  // Verifica se o horário já passou (para o dia atual)
  const isTimeSlotAvailable = (time: string) => {
    // Se o horário está na lista de indisponíveis
    if (unavailableSlots.includes(time)) return false

    // Se for hoje, verifica se o horário já passou
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

    if (selectedDay.getTime() === today.getTime()) {
      const [hours, minutes] = time.split(':').map(Number)
      const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
      return slotTime > now
    }

    return true
  }

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}h${minutes === '00' ? '' : '30'}`
  }

  // Se o estabelecimento estiver fechado neste dia
  if (!dayConfig.isOpen) {
    return (
      <div className="bg-pink-50/30 rounded-xl p-6 border border-pink-100">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-pink-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <p className="text-gray-800 font-light mb-1">Estabelecimento fechado neste dia</p>
          <p className="text-gray-500 text-sm">Por favor, selecione outra data</p>
        </div>
      </div>
    )
  }

  // Se não houver horários disponíveis
  if (timeSlots.length === 0) {
    return (
      <div className="bg-pink-50/30 rounded-xl p-6 border border-pink-100">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-pink-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-800 font-light mb-1">Nenhum horário disponível</p>
          <p className="text-gray-500 text-sm">Por favor, selecione outra data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {timeSlots.map((time) => {
          const isAvailable = isTimeSlotAvailable(time)
          return (
            <button
              key={time}
              onClick={() => isAvailable && onTimeSelect(time)}
              disabled={!isAvailable}
              className={`
                py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isAvailable
                    ? 'bg-white border border-[#FFB6C1] text-gray-700 hover:bg-pink-50 hover:border-[#FF69B4]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                ${selectedTime === time ? 'bg-pink-50 border-[#FF69B4] text-[#FF69B4]' : ''}
              `}
            >
              {formatTimeDisplay(time)}
            </button>
          )
        })}
      </div>

      {selectedTime && (
        <SelectedTimeDisplay 
          selectedTime={selectedTime} 
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
} 