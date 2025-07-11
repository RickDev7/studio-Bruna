'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

interface Appointment {
  id: string
  name: string
  service: string
  date: string
  time: string
  status: 'confirmado' | 'reagendado' | 'cancelado'
}

export function QuickActions() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Carregar agendamentos do Supabase ao montar
  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      setAppointments(data as Appointment[])
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-50 text-green-700'
      case 'reagendado':
        return 'bg-yellow-50 text-yellow-700'
      case 'cancelado':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const handleEdit = (id: string) => {
    // Implementar lógica de edição
    toast.info('Funcionalidade de edição em desenvolvimento')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return
    
    try {
      setIsSaving(true)
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAppointments(prev => prev.filter(app => app.id !== id))
      toast.success('Agendamento excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      toast.error('Erro ao excluir agendamento')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h2>

      <div className="space-y-2">
        <button className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200">
          Novo Agendamento
        </button>
        <button className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200">
          Gerenciar Serviços
        </button>
        <button className="w-full px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors duration-200">
          Configurações
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gerenciar Agendamentos</h3>

        {isLoading ? (
          <div className="flex items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF69B4]"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.service}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(appointment.id)}
                        className="text-[#FF69B4] hover:text-pink-800 bg-pink-50 px-3 py-1 rounded-md transition-colors duration-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        disabled={isSaving}
                        className="text-red-600 hover:text-red-800 bg-red-50 px-3 py-1 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
 