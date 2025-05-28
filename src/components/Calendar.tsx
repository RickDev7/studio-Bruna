import { useState, useEffect } from 'react'
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

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-light text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-pink-50 rounded-lg transition-colors flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-light text-gray-500 pb-3">
            {day}
          </div>
        ))}
        
        {calendar.map((week, weekIndex) => (
          week.map((date, dateIndex) => {
            const isSelected = date.toDateString() === selectedDate.toDateString()
            const isAvailable = isDateAvailable(date)
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <button
                key={`${weekIndex}-${dateIndex}`}
                onClick={() => isAvailable && onDateSelect(date)}
                disabled={!isAvailable}
                className={`
                  relative p-2 text-center transition-all duration-300
                  rounded-lg group
                  ${isSelected 
                    ? 'bg-pink-50 text-gray-800' 
                    : isAvailable && isCurrentMonth
                      ? 'hover:bg-pink-50/50 text-gray-600'
                      : 'text-gray-300 cursor-not-allowed'}
                  ${!isCurrentMonth ? 'opacity-40' : ''}
                  ${isToday && !isSelected ? 'bg-pink-50/50' : ''}
                `}
              >
                <span className={`
                  text-base
                  ${isSelected ? 'font-medium' : isToday ? 'font-medium' : 'font-light'}
                `}>
                  {date.getDate()}
                </span>
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-200 rounded-full" />
                )}
                {isAvailable && !isSelected && (
                  <span className="absolute inset-0 rounded-lg border border-transparent group-hover:border-pink-100 transition-colors" />
                )}
                {isSelected && (
                  <span className="absolute inset-0 rounded-lg border border-pink-200" />
                )}
              </button>
            )
          })
        ))}
      </div>
    </div>
  )
} 