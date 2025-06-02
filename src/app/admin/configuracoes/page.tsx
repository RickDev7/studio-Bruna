'use client'

import { useState } from 'react'
import { useBusinessConfig } from '@/hooks/useBusinessConfig'
import { toast } from 'sonner'
import { weekDays } from '@/config/businessConfig'

export default function ConfiguracoesPage() {
  const { config, isLoading, saveConfig, formatWeekDay } = useBusinessConfig()
  const [formData, setFormData] = useState(config)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await saveConfig(formData)
      if (result.success) {
        toast.success('Configurações salvas com sucesso!')
      } else {
        throw result.error
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      toast.error('Erro ao salvar configurações')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleHoursChange = (
    day: keyof typeof weekDays,
    field: 'start' | 'end' | 'lunchStart' | 'lunchEnd',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">Configurações</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome do Negócio
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Endereço
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email do Administrador
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Horário de Funcionamento
              </h3>
              {(Object.keys(formData.businessHours) as Array<keyof typeof weekDays>).map((day) => (
                <div key={day} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {formatWeekDay(day)}
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        type="time"
                        value={formData.businessHours[day].start}
                        onChange={(e) => handleHoursChange(day, 'start', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                      <input
                        type="time"
                        value={formData.businessHours[day].end}
                        onChange={(e) => handleHoursChange(day, 'end', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Horário de Almoço
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <input
                        type="time"
                        value={formData.businessHours[day].lunchStart || ''}
                        onChange={(e) => handleHoursChange(day, 'lunchStart', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                      <input
                        type="time"
                        value={formData.businessHours[day].lunchEnd || ''}
                        onChange={(e) => handleHoursChange(day, 'lunchEnd', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
} 