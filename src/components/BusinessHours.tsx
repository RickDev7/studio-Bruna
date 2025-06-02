'use client'

import { usePublicBusinessConfig } from '@/hooks/usePublicBusinessConfig'
import { weekDays } from '@/config/businessConfig'
import { Clock } from 'lucide-react'

export function BusinessHours() {
  const { config, isLoading, isBusinessOpen, getBusinessHours } = usePublicBusinessConfig()
  const today = new Date()
  const isOpen = isBusinessOpen(today)

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-[#FF69B4]" />
          <h3 className="text-lg font-medium text-gray-900">
            Horário de Funcionamento
          </h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOpen ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isOpen ? 'Aberto' : 'Fechado'}
        </span>
      </div>

      <div className="space-y-2">
        {(Object.keys(weekDays) as Array<keyof typeof weekDays>).map((day) => (
          <div key={day} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{weekDays[day]}</span>
            <span className="text-gray-900 font-medium">
              {getBusinessHours(day)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {config.name} • {config.address}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {config.phone} • {config.email}
        </div>
      </div>
    </div>
  )
} 