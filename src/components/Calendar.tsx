'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { businessHours, holidays } from '@/config/businessHours'

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate())
  
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()
  
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Gera o calendário do mês atual
  React.useEffect(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
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
    
    setSelectedDay(selectedDate.getDate())
  }, [currentDate, selectedDate])

  // Verifica se uma data está disponível para agendamento
  const isDateAvailable = (date: Date) => {
    // Não permite datas passadas
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date.getTime() < today.getTime()) return false

    // Verifica se é feriado
    const dateString = date.toISOString().split('T')[0]
    if (holidays.includes(dateString)) return false

    // Verifica horário de funcionamento
    const dayOfWeek = date.getDay()
    const dayConfig = businessHours[dayOfWeek]
    return dayConfig.isOpen
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 p-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: 31 }, (_, i) => i + 1).map((day, index) => {
          const date = new Date(currentYear, currentMonth, day);
          const isDisabled = isPastDate(date) || !isDateAvailable(date);
          const isCurrentMonth = date.getMonth() === currentMonth;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onDateSelect(date)}
              disabled={isDisabled}
              className={`
                text-center py-2 rounded-full mx-1
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-pink-50'}
                ${isToday(date) ? 'bg-pink-50 text-[#FF69B4]' : ''}
                ${isSelected(date) ? 'bg-[#FF69B4] text-white hover:bg-[#FF69B4]' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
} 