'use client'

import React from 'react'
import { businessHours } from '@/config/businessHours'
import { SelectedTimeDisplay } from './SelectedTimeDisplay'
import { useAvailableSlots } from '@/hooks/useAvailableSlots'

interface TimeSlotsProps {
  selectedDate: Date
  selectedTime: string
  onTimeSelect: (time: string) => void
}

export function TimeSlots({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect
}: TimeSlotsProps) {
  // Obtém a configuração do dia selecionado
  const dayOfWeek = selectedDate.getDay()
  const dayConfig = businessHours[dayOfWeek]

  // Usa o hook para gerenciar os horários disponíveis
  const { availableSlots, isLoading, error } = useAvailableSlots({
    selectedDate,
    dayConfig
  })

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

  // Se estiver carregando
  if (isLoading) {
    return (
      <div className="bg-pink-50/30 rounded-xl p-6 border border-pink-100">
        <div className="flex flex-col items-center justify-center">
          <svg className="animate-spin w-10 h-10 text-pink-200 mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-800 font-light mb-1">Carregando horários disponíveis...</p>
        </div>
      </div>
    )
  }

  // Se houver erro
  if (error) {
    return (
      <div className="bg-pink-50/30 rounded-xl p-6 border border-pink-100">
        <div className="flex flex-col items-center justify-center">
          <svg className="w-10 h-10 text-pink-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-800 font-light mb-1">{error}</p>
          <p className="text-gray-500 text-sm">Por favor, tente novamente mais tarde</p>
        </div>
      </div>
    )
  }

  // Se não houver horários disponíveis
  if (availableSlots.length === 0) {
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
        {availableSlots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300
              ${
                selectedTime === time
                  ? 'bg-pink-50 border-[#FF69B4] text-[#FF69B4] border'
                  : 'bg-white border border-[#FFB6C1] text-gray-700 hover:bg-pink-50 hover:border-[#FF69B4]'
              }
            `}
          >
            {formatTimeDisplay(time)}
          </button>
        ))}
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