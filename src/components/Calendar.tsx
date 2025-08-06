'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { businessHours, holidays } from '@/config/businessHours'

interface CalendarProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  highlightedDates?: Date[]
  disabledDates?: Date[]
}

export function Calendar({
  selectedDate,
  onDateSelect,
  highlightedDates = [],
  disabledDates = []
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isHighlighted = (date: Date) => {
    return highlightedDates.some(d => d.toDateString() === date.toDateString())
  }

  const isDisabled = (date: Date) => {
    // Verifica se é um feriado
    const dateString = date.toISOString().split('T')[0]
    if (holidays.includes(dateString)) return true

    // Verifica se o estabelecimento está fechado neste dia
    const dayOfWeek = date.getDay()
    const dayConfig = businessHours[dayOfWeek]
    if (!dayConfig.isOpen) return true

    return disabledDates.some(d => d.toDateString() === date.toDateString())
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isFutureDate = (date: Date) => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 60) // Permite agendamento até 60 dias no futuro
    return date > maxDate
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getDateStatus = (date: Date) => {
    if (isPastDate(date)) return 'past'
    if (isFutureDate(date)) return 'future'
    if (isDisabled(date)) return 'disabled'
    if (isSelected(date)) return 'selected'
    if (isToday(date)) return 'today'
    if (isHighlighted(date)) return 'highlighted'
    
    const dayOfWeek = date.getDay()
    const dayConfig = businessHours[dayOfWeek]
    if (!dayConfig.isOpen) return 'closed'
    
    return 'available'
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDayOfMonth = getFirstDayOfMonth(currentDate)
    const days = []

    // Dias do mês anterior
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-center py-3" />
      )
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const status = getDateStatus(date)
      const disabled = status === 'past' || status === 'disabled' || status === 'future' || status === 'closed'

      days.push(
        <button
          key={day}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          className={`
            relative w-full h-12 rounded-lg transition-all duration-300
            ${
              status === 'past' || status === 'future'
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : status === 'disabled'
                ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                : status === 'closed'
                ? 'text-gray-300 cursor-not-allowed bg-gray-100'
                : status === 'selected'
                ? 'bg-[#FF69B4] text-white hover:bg-[#FF69B4] shadow-lg scale-105'
                : status === 'today'
                ? 'bg-pink-50 text-[#FF69B4] border border-[#FF69B4]'
                : status === 'highlighted'
                ? 'border-2 border-[#FF69B4] hover:bg-pink-50'
                : 'hover:bg-pink-50 hover:scale-105'
            }
            group
          `}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-sm group-hover:font-medium">{day}</span>
            {status === 'highlighted' && (
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FF69B4] rounded-full" />
            )}

            {status === 'closed' && (
              <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400">
                Fechado
              </span>
            )}
          </div>
        </button>
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-pink-100">
      {/* Cabeçalho do Calendário */}
      <div className="flex items-center justify-between p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#FF69B4] mr-2" />
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:shadow-md"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 p-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {/* Dias do Mês */}
        {renderCalendarDays()}
      </div>

      {/* Legenda */}
      <div className="px-4 pb-4 pt-2 border-t border-pink-100 bg-gradient-to-r from-white to-pink-50">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF69B4] mr-2" />
            <span>Selecionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-50 border border-[#FF69B4] mr-2" />
            <span>Hoje</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border-2 border-[#FF69B4] mr-2" />
            <span>Com Agendamento</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-100 mr-2" />
            <span>Fechado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-50 mr-2" />
            <span>Indisponível</span>
          </div>
        </div>
      </div>
    </div>
  )
}