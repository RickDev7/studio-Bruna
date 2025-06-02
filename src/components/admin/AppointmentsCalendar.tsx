'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/Calendar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'

interface Profile {
  id: string
  full_name: string | null
  email: string
}

interface Appointment {
  id: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string | null
  user_id: string
  profiles: Profile
}

interface EditingAppointment extends Appointment {
  isEditing?: boolean
}

export function AppointmentsCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [appointments, setAppointments] = useState<EditingAppointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editedAppointments, setEditedAppointments] = useState<{ [key: string]: EditingAppointment }>({})
  const [deletedAppointments, setDeletedAppointments] = useState<string[]>([])
  const supabase = createClientComponentClient()

  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          service,
          date,
          time,
          status,
          notes,
          user_id,
          profiles!inner (
            id,
            full_name,
            email
          )
        `)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (error) throw error

      const formattedAppointments = (data || []).map(appointment => ({
        ...appointment,
        profiles: {
          id: appointment.profiles?.[0]?.id || '',
          full_name: appointment.profiles?.[0]?.full_name || null,
          email: appointment.profiles?.[0]?.email || ''
        }
      })) as EditingAppointment[]

      setAppointments(formattedAppointments)
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error)
      toast.error('Erro ao carregar agendamentos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const getAppointmentsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return appointments.filter(appointment => appointment.date === dateString)
  }

  const handleEdit = (appointment: EditingAppointment) => {
    // Garante que todos os dados necessários estejam presentes
    const editingAppointment = {
      ...appointment,
      profiles: {
        id: appointment.profiles.id,
        full_name: appointment.profiles.full_name || '',
        email: appointment.profiles.email
      }
    }
    
    setEditedAppointments(prev => ({
      ...prev,
      [appointment.id]: editingAppointment
    }))
  }

  const handleChange = (id: string, field: keyof EditingAppointment, value: any) => {
    setEditedAppointments(prev => {
      const appointment = prev[id]
      if (!appointment) return prev

      if (field === 'profiles') {
        return {
          ...prev,
          [id]: {
            ...appointment,
            profiles: {
              ...appointment.profiles,
              ...value
            }
          }
        }
      }

      return {
        ...prev,
        [id]: {
          ...appointment,
          [field]: value
        }
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

    // Marca o agendamento para exclusão
    setDeletedAppointments(prev => [...prev, id])
    
    // Remove do estado de edição se estiver sendo editado
    setEditedAppointments(prev => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })

    // Atualiza a visualização imediatamente
    setAppointments(prev => prev.filter(app => app.id !== id))
    
    toast.success('Agendamento marcado para exclusão')
  }

  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (isSaving) return

    try {
      setIsSaving(true)

      // Processa as atualizações
      if (Object.keys(editedAppointments).length > 0) {
        for (const appointment of Object.values(editedAppointments)) {
          // Atualiza o perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: appointment.profiles.id,
              full_name: appointment.profiles.full_name,
              email: appointment.profiles.email,
              updated_at: new Date().toISOString()
            })

          if (profileError) {
            throw new Error(`Erro ao atualizar perfil: ${profileError.message}`)
          }

          // Atualiza o agendamento
          const { error: appointmentError } = await supabase
            .from('appointments')
            .update({
              service: appointment.service,
              date: appointment.date,
              time: appointment.time,
              status: appointment.status,
              notes: appointment.notes,
              updated_at: new Date().toISOString()
            })
            .eq('id', appointment.id)

          if (appointmentError) {
            throw new Error(`Erro ao atualizar agendamento: ${appointmentError.message}`)
          }
        }
      }

      // Processa as exclusões
      if (deletedAppointments.length > 0) {
        for (const id of deletedAppointments) {
          const { error: deleteError } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id)

          if (deleteError) {
            throw new Error(`Erro ao excluir agendamento: ${deleteError.message}`)
          }
        }
      }

      // Limpa os estados
      setEditedAppointments({})
      setDeletedAppointments([])

      // Recarrega os agendamentos
      await fetchAppointments()

      toast.success('Alterações salvas com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar alterações:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar alterações')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: 'pending' | 'confirmed' | 'cancelled') => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700'
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-yellow-50 text-yellow-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF69B4]"></div>
      </div>
    )
  }

  const hasChanges = Object.keys(editedAppointments).length > 0 || deletedAppointments.length > 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            highlightedDates={appointments.map(a => new Date(a.date))}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
            </h3>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum agendamento para esta data</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {getAppointmentsForDate(selectedDate).map((appointment) => {
                  const editedAppointment = editedAppointments[appointment.id]
                  const currentAppointment = editedAppointment || appointment
                  const isEditing = !!editedAppointments[appointment.id]

                  return (
                    <div 
                      key={appointment.id} 
                      className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-200 ${
                        isEditing ? 'border-pink-300 ring-1 ring-pink-300' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-2 w-2 rounded-full bg-[#FF69B4]"></div>
                          <span className="text-lg font-medium">{currentAppointment.time}</span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAppointment.status)}`}>
                          {currentAppointment.status === 'confirmed' ? 'Confirmado' :
                           currentAppointment.status === 'cancelled' ? 'Cancelado' : 'Pendente'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                          <input
                            type="text"
                            value={currentAppointment.profiles.full_name || ''}
                            onChange={(e) => handleChange(appointment.id, 'profiles', { ...currentAppointment.profiles, full_name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="Nome do cliente"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <input
                            type="email"
                            value={currentAppointment.profiles.email}
                            onChange={(e) => handleChange(appointment.id, 'profiles', { ...currentAppointment.profiles, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            placeholder="email@exemplo.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Serviço</label>
                          <input
                            type="text"
                            value={currentAppointment.service}
                            onChange={(e) => handleChange(appointment.id, 'service', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={currentAppointment.status}
                            onChange={(e) => handleChange(appointment.id, 'status', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${getStatusColor(currentAppointment.status)}`}
                          >
                            <option value="pending">Pendente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                          <textarea
                            value={currentAppointment.notes || ''}
                            onChange={(e) => handleChange(appointment.id, 'notes', e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                            rows={2}
                            placeholder="Adicione observações importantes aqui..."
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        {!isEditing ? (
                          <button
                            onClick={() => handleEdit(appointment)}
                            className="px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-md hover:bg-pink-100 transition-colors duration-200"
                          >
                            Editar
                          </button>
                        ) : (
                          <button
                            onClick={() => setEditedAppointments(prev => {
                              const newState = { ...prev }
                              delete newState[appointment.id]
                              return newState
                            })}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {hasChanges && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">
                    {Object.keys(editedAppointments).length} agendamento(s) modificado(s)
                  </span>
                  {deletedAppointments.length > 0 && (
                    <span className="ml-2">
                      e <span className="font-medium text-red-600">{deletedAppointments.length}</span> excluído(s)
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  type="button"
                  className={`
                    px-6 py-2 bg-[#FF69B4] text-white rounded-lg hover:bg-pink-600 
                    transition-all duration-200 flex items-center space-x-2
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isSaving ? (
                    <>
                      <svg 
                        className="animate-spin h-5 w-5" 
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle 
                          className="opacity-25" 
                          cx="12" 
                          cy="12" 
                          r="10" 
                          stroke="currentColor" 
                          strokeWidth="4"
                        />
                        <path 
                          className="opacity-75" 
                          fill="currentColor" 
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 