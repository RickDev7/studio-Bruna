import React, { useState, useEffect } from 'react'
import { businessHours } from '@/config/businessHours'

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendar, setCalendar] = useState<Date[][]>([])

  // Gera o calendário do mês atual
  useEffect(() => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    
    const endDate = new Date(lastDay)
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
    }
    
    const weeks: Date[][] = []
    let currentWeek: Date[] = []
    
    const current = new Date(startDate)
    while (current <= endDate) {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      currentWeek.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }
    
    setCalendar(weeks)
  }, [currentMonth])

  // Verifica se uma data está disponível para agendamento
  const isDateAvailable = (date: Date) => {
    // Não permite datas passadas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date.getTime() < today.getTime()) return false

    // Verifica se é feriado
    const dateString = date.toISOString().split('T')[0]
    if (businessHours.holidays.includes(dateString)) return false

    // Verifica horário de funcionamento
    const dayOfWeek = date.getDay()
    const dayConfig = businessHours.weekdays[dayOfWeek as keyof typeof businessHours.weekdays]
    return dayConfig.isOpen
  }

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() - 1)
      return newDate
    })
  }

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + 1)
      return newDate
    })
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-pink-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center py-2 text-sm font-medium text-gray-600"
          >
            {day}
          </div>
        ))}

        {calendar.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((date, dateIndex) => {
              const isAvailable = isDateAvailable(date)
              const isSelected = selectedDate && 
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()

              return (
                <button
                  key={dateIndex}
                  onClick={() => isAvailable && onDateSelect(date)}
                  disabled={!isAvailable}
                  className={`
                    relative p-2 w-full text-center rounded-lg transition-all duration-300
                    ${isSelected
                      ? 'bg-pink-50 text-gray-800 border border-pink-200'
                      : isAvailable && isCurrentMonth
                        ? 'hover:bg-pink-50/50 text-gray-800 border border-transparent hover:border-pink-100'
                        : isCurrentMonth
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <span className={`text-sm ${isSelected ? 'font-medium' : 'font-light'}`}>
                    {date.getDate()}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1">
                      <svg className="w-4 h-4 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
} 