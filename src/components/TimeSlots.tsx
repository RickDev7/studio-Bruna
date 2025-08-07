'use client'

import React from 'react'
import { businessHours } from '@/config/businessHours'
import { SelectedTimeDisplay } from './SelectedTimeDisplay'
import { useAvailableSlots } from '@/hooks/useAvailableSlots'
import { Clock, Sun, Moon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface TimeSlotsProps {
  selectedDate: Date
  selectedTime: string
  onTimeSelect: (time: string) => void
}

interface TimeSlotGroupProps {
  title: string
  icon: React.ReactNode
  slots: string[]
  selectedTime: string
  onTimeSelect: (time: string) => void
}

// Função auxiliar para formatar a exibição do horário
const formatTimeDisplay = (time: string) => {
  const [hours, minutes] = time.split(':')
  return `${hours}h${minutes === '00' ? '' : '30'}`
}

function TimeSlotGroup({ title, icon, slots, selectedTime, onTimeSelect }: TimeSlotGroupProps) {
  const { t } = useLanguage()
  if (slots.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-xl border border-pink-100">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-medium text-gray-900 ml-2">{title}</h3>
        <span className="ml-auto text-sm text-gray-500">{slots.length} {t('scheduling.timeSlots.timeSlots')}</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {slots.map((time) => (
          <button
            key={time}
            onClick={() => onTimeSelect(time)}
            className={`
              relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 group
              ${
                selectedTime === time
                  ? 'bg-[#FF69B4] text-white shadow-lg scale-105'
                  : 'bg-white border border-[#FFB6C1] text-gray-700 hover:bg-pink-50 hover:border-[#FF69B4] hover:scale-105'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <Clock className={`w-4 h-4 mb-1 ${selectedTime === time ? 'text-white' : 'text-[#FF69B4] group-hover:text-[#FF69B4]'}`} />
              {formatTimeDisplay(time)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export function TimeSlots({ 
  selectedDate, 
  selectedTime, 
  onTimeSelect
}: TimeSlotsProps) {
  const { t } = useLanguage()
  // Obtém a configuração do dia selecionado
  const dayOfWeek = selectedDate.getDay()
  const dayConfig = businessHours[dayOfWeek]

  // Usa o hook para gerenciar os horários disponíveis
  const { availableSlots, isLoading, error } = useAvailableSlots({
    selectedDate,
    dayConfig
  })

  // Agrupa os horários por período
  const groupSlots = (slots: string[]) => {
    return {
      morning: slots.filter(time => {
        const hour = parseInt(time.split(':')[0])
        return hour >= 6 && hour < 12
      }),
      afternoon: slots.filter(time => {
        const hour = parseInt(time.split(':')[0])
        return hour >= 12 && hour < 18
      }),
      evening: slots.filter(time => {
        const hour = parseInt(time.split(':')[0])
        return hour >= 18
      })
    }
  }

  // Se o estabelecimento estiver fechado neste dia
  if (!dayConfig.isOpen) {
    return (
      <div className="bg-gradient-to-br from-pink-50/30 to-white rounded-xl p-8 border border-pink-100">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-[#FF69B4]" />
          </div>
          <p className="text-xl text-gray-800 font-medium mb-2">{t('scheduling.timeSlots.closed.title')}</p>
          <p className="text-gray-500">{t('scheduling.timeSlots.closed.description')}</p>
        </div>
      </div>
    )
  }

  // Se estiver carregando
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-pink-50/30 to-white rounded-xl p-8 border border-pink-100">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 animate-spin">
            <Clock className="w-8 h-8 text-[#FF69B4]" />
          </div>
          <p className="text-xl text-gray-800 font-medium mb-2">{t('scheduling.timeSlots.loading.title')}</p>
          <p className="text-gray-500">{t('scheduling.timeSlots.loading.description')}</p>
        </div>
      </div>
    )
  }

  // Se houver erro
  if (error) {
    return (
      <div className="bg-gradient-to-br from-pink-50/30 to-white rounded-xl p-8 border border-pink-100">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-xl text-gray-800 font-medium mb-2">{t('scheduling.timeSlots.error.title')}</p>
          <p className="text-gray-500">{error}</p>
          <p className="text-gray-500">{t('scheduling.timeSlots.error.description')}</p>
        </div>
      </div>
    )
  }

  // Se não houver horários disponíveis
  if (availableSlots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-pink-50/30 to-white rounded-xl p-8 border border-pink-100">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-[#FF69B4]" />
          </div>
          <p className="text-xl text-gray-800 font-medium mb-2">{t('scheduling.timeSlots.noSlots.title')}</p>
          <p className="text-gray-500">{t('scheduling.timeSlots.noSlots.description')}</p>
        </div>
      </div>
    )
  }

  const groupedSlots = groupSlots(availableSlots)

  return (
    <div className="space-y-6">
      <TimeSlotGroup
        title={t('scheduling.timeSlots.morning')}
        icon={<Sun className="w-5 h-5 text-[#FF69B4]" />}
        slots={groupedSlots.morning}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      <TimeSlotGroup
        title={t('scheduling.timeSlots.afternoon')}
        icon={<Sun className="w-5 h-5 text-[#FF69B4]" />}
        slots={groupedSlots.afternoon}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      <TimeSlotGroup
        title={t('scheduling.timeSlots.evening')}
        icon={<Moon className="w-5 h-5 text-[#FF69B4]" />}
        slots={groupedSlots.evening}
        selectedTime={selectedTime}
        onTimeSelect={onTimeSelect}
      />

      {selectedTime && (
        <SelectedTimeDisplay 
          selectedTime={selectedTime} 
          selectedDate={selectedDate}
        />
      )}
    </div>
  )
} 