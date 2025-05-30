'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { resendConfig } from '@/config/resend'

interface Settings {
  businessName: string
  businessAddress: string
  businessPhone: string
  adminEmail: string
  workingHours: {
    [key: string]: {
      start: string
      end: string
      lunch: {
        start: string
        end: string
      }
    }
  }
}

export default function ConfiguracoesPage() {
  const [settings, setSettings] = useState<Settings>({
    businessName: resendConfig.businessInfo.name,
    businessAddress: resendConfig.businessInfo.address,
    businessPhone: resendConfig.businessInfo.phone,
    adminEmail: resendConfig.businessInfo.email,
    workingHours: {
      monday: { start: '09:00', end: '18:00', lunch: { start: '13:00', end: '14:00' } },
      tuesday: { start: '09:00', end: '18:00', lunch: { start: '13:00', end: '14:00' } },
      wednesday: { start: '09:00', end: '18:00', lunch: { start: '13:00', end: '14:00' } },
      thursday: { start: '09:00', end: '18:00', lunch: { start: '13:00', end: '14:00' } },
      friday: { start: '09:00', end: '18:00', lunch: { start: '13:00', end: '14:00' } },
      saturday: { start: '09:00', end: '14:00', lunch: { start: '', end: '' } },
      sunday: { start: '', end: '', lunch: { start: '', end: '' } }
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Atualizar configurações no banco de dados
      const { error } = await supabase
        .from('settings')
        .upsert({
          business_name: settings.businessName,
          business_address: settings.businessAddress,
          business_phone: settings.businessPhone,
          admin_email: settings.adminEmail,
          working_hours: settings.workingHours
        })

      if (error) throw error

      toast.success('Configurações atualizadas com sucesso!')
      router.refresh()
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      toast.error('Erro ao atualizar configurações')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Negócio
          </label>
          <input
            type="text"
            value={settings.businessName}
            onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input
            type="text"
            value={settings.businessAddress}
            onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Telefone
          </label>
          <input
            type="text"
            value={settings.businessPhone}
            onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email do Administrador
          </label>
          <input
            type="email"
            value={settings.adminEmail}
            onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Horário de Funcionamento</h3>
          {Object.entries(settings.workingHours).map(([day, hours]) => (
            <div key={day} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {day}
                </label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="time"
                    value={hours.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        [day]: { ...hours, start: e.target.value }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                  <input
                    type="time"
                    value={hours.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        [day]: { ...hours, end: e.target.value }
                      }
                    })}
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
                    value={hours.lunch.start}
                    onChange={(e) => setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        [day]: {
                          ...hours,
                          lunch: { ...hours.lunch, start: e.target.value }
                        }
                      }
                    })}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  />
                  <input
                    type="time"
                    value={hours.lunch.end}
                    onChange={(e) => setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        [day]: {
                          ...hours,
                          lunch: { ...hours.lunch, end: e.target.value }
                        }
                      }
                    })}
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
            disabled={isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
} 