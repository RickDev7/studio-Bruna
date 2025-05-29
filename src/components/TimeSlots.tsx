import React from 'react'
import { businessHours } from '@/config/businessHours'

interface TimeSlotsProps {
  selectedDate: Date
  selectedTime: string
  onTimeSelect: (time: string) => void
}

type DayConfig = {
  isOpen: boolean
  hours?: {
    start: string
    end: string
    lunchBreak: {
      start: string
      end: string
    }
  }
}

export function TimeSlots({ selectedDate, selectedTime, onTimeSelect }: TimeSlotsProps) {
  // Gera os horários disponíveis para o dia selecionado
  const getAvailableSlots = () => {
    const dayOfWeek = selectedDate.getDay()
    const dayConfig = businessHours.weekdays[dayOfWeek as keyof typeof businessHours.weekdays] as DayConfig
    
    if (!dayConfig.isOpen || !dayConfig.hours) return []
    
    const slots: string[] = []
    const { start, end, lunchBreak } = dayConfig.hours
    const slotDuration = businessHours.slotDuration
    
    // Converte horário para minutos desde meia-noite
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    }
    
    // Converte minutos em formato de horário
    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
    }
    
    let currentMinutes = timeToMinutes(start)
    const endMinutes = timeToMinutes(end)
    const lunchStartMinutes = timeToMinutes(lunchBreak.start)
    const lunchEndMinutes = timeToMinutes(lunchBreak.end)
    
    // Gera slots até o horário de almoço
    while (currentMinutes < lunchStartMinutes) {
      slots.push(minutesToTime(currentMinutes))
      currentMinutes += slotDuration
    }
    
    // Pula o horário de almoço e continua gerando slots
    currentMinutes = lunchEndMinutes
    while (currentMinutes < endMinutes) {
      slots.push(minutesToTime(currentMinutes))
      currentMinutes += slotDuration
    }
    
    return slots
  }

  const availableSlots = getAvailableSlots()

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':')
    return `${hours}h${minutes === '00' ? '' : '30'}`
  }

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {availableSlots.map(time => {
        const isSelected = time === selectedTime
        
        return (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              group relative p-3 rounded-lg transition-all duration-300 border
              ${isSelected 
                ? 'bg-pink-50 text-gray-800 border-pink-200' 
                : 'bg-white text-gray-600 border-pink-50 hover:border-pink-200 hover:bg-pink-50/50'}
            `}
          >
            <div className="flex items-center justify-center">
              <span className={`text-base ${isSelected ? 'font-medium' : 'font-light'}`}>
                {formatTimeDisplay(time)}
              </span>
              {isSelected && (
                <div className="absolute -top-1 -right-1">
                  <svg className="w-4 h-4 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
} 