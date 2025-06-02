'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { businessHours, holidays } from '@/config/businessHours'

interface CalendarProps {
  selectedDate: Date
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
    return date.toDateString() === selectedDate.toDateString()
  }

  const isHighlighted = (date: Date) => {
    return highlightedDates.some(d => d.toDateString() === date.toDateString())
  }

  const isDisabled = (date: Date) => {
    return disabledDates.some(d => d.toDateString() === date.toDateString())
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
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
      const disabled = isPastDate(date) || isDisabled(date)

      days.push(
        <button
          key={day}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          className={`
            relative w-full h-12 rounded-lg transition-colors duration-200
            ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-pink-50'}
            ${isSelected(date) ? 'bg-[#FF69B4] text-white hover:bg-[#FF69B4]' : ''}
            ${isToday(date) ? 'bg-pink-50 text-[#FF69B4]' : ''}
            ${isHighlighted(date) && !isSelected(date) ? 'border-2 border-[#FF69B4]' : ''}
          `}
        >
          <span className="text-sm">{day}</span>
          {isHighlighted(date) && (
            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FF69B4] rounded-full" />
          )}
        </button>
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Cabeçalho do Calendário */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
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
      <div className="px-4 pb-4 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#FF69B4] mr-2" />
            <span>Selecionado</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-pink-50 mr-2" />
            <span>Hoje</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full border-2 border-[#FF69B4] mr-2" />
            <span>Com Agendamento</span>
          </div>
        </div>
      </div>
    </div>
  )
} 