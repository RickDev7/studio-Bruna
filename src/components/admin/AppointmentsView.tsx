'use client'

import { useState } from 'react'
import { Calendar } from '@/components/Calendar'
import { Clock, User, Mail, Briefcase, MessageSquare, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

interface Appointment {
  id: string
  client_name: string
  client_email: string
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string
}

interface AppointmentsViewProps {
  appointments: Appointment[]
  onAppointmentUpdate: (appointment: Appointment) => Promise<void>
  onAppointmentDelete: (id: string) => Promise<void>
}

export function AppointmentsView({ 
  appointments,
  onAppointmentUpdate,
  onAppointmentDelete
}: AppointmentsViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Scroll para o topo da lista quando mudar a data
    const appointmentsList = document.getElementById('appointments-list')
    if (appointmentsList) {
      appointmentsList.scrollTop = 0
    }
  }

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700'
      case 'cancelled':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-yellow-50 text-yellow-700'
    }
  }

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Pendente'
    }
  }

  const handleEdit = (id: string) => {
    setEditingId(id === editingId ? null : id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este agendamento?')) return

    try {
      setIsLoading(true)
      await onAppointmentDelete(id)
      toast.success('Agendamento excluído com sucesso')
    } catch (error) {
      console.error('Erro ao excluir agendamento:', error)
      toast.error('Erro ao excluir agendamento')
    } finally {
      setIsLoading(false)
    }
  }

  const getAppointmentsForDate = (date: Date) => {
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= startOfDay && appointmentDate <= endOfDay
      })
      .sort((a, b) => a.time.localeCompare(b.time))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const selectedAppointments = getAppointmentsForDate(selectedDate)
  const hasAppointments = selectedAppointments.length > 0

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:sticky lg:top-4 lg:self-start">
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            highlightedDates={appointments.map(a => new Date(a.date))}
          />

          {/* Resumo do dia */}
          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-[#FF69B4]" />
              <h4 className="font-medium text-gray-900">Resumo do Dia</h4>
            </div>
            <p className="text-sm text-gray-600">
              {hasAppointments 
                ? `${selectedAppointments.length} agendamento${selectedAppointments.length > 1 ? 's' : ''}`
                : 'Nenhum agendamento'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-4 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Agendamentos
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(selectedDate)}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            {!hasAppointments ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhum agendamento para esta data</p>
                <p className="text-sm text-gray-400 mt-1">
                  Selecione outra data no calendário ou adicione um novo agendamento
                </p>
              </div>
            ) : (
              <div id="appointments-list" className="space-y-4 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                {selectedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={`
                      bg-white p-6 rounded-lg shadow-sm border transition-all duration-200
                      ${editingId === appointment.id ? 'border-pink-300 ring-1 ring-pink-300' : 'border-gray-100 hover:border-gray-200'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-[#FF69B4]" />
                        <span className="text-lg font-medium">{appointment.time}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.client_name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.client_email}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">{appointment.service}</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(appointment.id)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-[#FF69B4] bg-pink-50 rounded-md hover:bg-pink-100 transition-colors duration-200 disabled:opacity-50"
                      >
                        {editingId === appointment.id ? 'Cancelar' : 'Editar'}
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 