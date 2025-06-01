'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Profile {
  full_name: string | null
  email: string
}

interface AppointmentWithProfiles {
  id: string
  user_id: string
  service: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string | null
  created_at: string
  updated_at: string
  profiles: Profile
}

interface Appointment {
  id: string
  user_id: string
  service: string
  scheduled_at: string
  status: 'pending' | 'confirmed' | 'cancelled'
  notes: string | null
  created_at: string
  profile: {
    full_name: string | null
    email: string
  }
}

interface AdminDashboardProps {
  initialAppointments: Appointment[]
}

export function AdminDashboard({ initialAppointments }: AdminDashboardProps) {
  const [appointments, setAppointments] = useState(initialAppointments || [])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log('Configurando Realtime...')
    
    // Função para buscar um agendamento específico com dados do perfil
    const fetchAppointment = async (appointmentId: string) => {
      try {
        console.log('Buscando detalhes do agendamento:', appointmentId)
        
        const { data: appointment, error } = await supabase
          .from('appointments')
          .select(`
            id,
            user_id,
            profile_id,
            service,
            scheduled_at,
            status,
            notes,
            created_at,
            updated_at,
            profiles:profile_id (
              full_name,
              email
            )
          `)
          .eq('id', appointmentId)
          .single<AppointmentWithProfiles>()

        if (error) {
          console.error('Erro detalhado ao buscar agendamento:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          })
          toast.error('Erro ao buscar detalhes do agendamento')
          return
        }

        console.log('Detalhes do agendamento recebidos:', appointment)

        if (appointment) {
          // Formatar os dados do agendamento para corresponder à interface Appointment
          const formattedAppointment: Appointment = {
            ...appointment,
            profile: {
              full_name: appointment.profiles.full_name,
              email: appointment.profiles.email
            }
          }

          setAppointments(current => {
            // Verificar se o agendamento já existe na lista
            const exists = current.some(app => app.id === appointmentId)
            if (exists) {
              // Atualizar o agendamento existente
              return current.map(app => 
                app.id === appointmentId ? formattedAppointment : app
              )
            }
            // Adicionar novo agendamento no início da lista
            return [formattedAppointment, ...current]
          })
        }
      } catch (error) {
        console.error('Erro ao buscar agendamento:', error)
        toast.error('Erro ao buscar detalhes do agendamento')
      }
    }

    // Inscrever-se para atualizações em tempo real
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Novo agendamento recebido:', payload)
          // Buscar os dados completos do agendamento incluindo o perfil
          fetchAppointment(payload.new.id)
          // Notificar o administrador
          toast.info('Novo agendamento recebido!', {
            description: `Serviço: ${payload.new.service}`,
            action: {
              label: 'Ver detalhes',
              onClick: () => router.refresh()
            }
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Agendamento atualizado:', payload)
          // Buscar os dados atualizados do agendamento
          fetchAppointment(payload.new.id)
        }
      )
      .subscribe((status) => {
        console.log('Status da inscrição:', status)
      })

    console.log('Canal configurado:', channel)

    // Limpar inscrição quando o componente for desmontado
    return () => {
      console.log('Limpando inscrição do canal...')
      supabase.removeChannel(channel)
    }
  }, [router, supabase])

  const sendStatusEmail = async (appointment: Appointment, newStatus: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: appointment.profile.full_name || 'Cliente',
          userEmail: appointment.profile.email,
          service: appointment.service,
          date: new Date(appointment.scheduled_at).toLocaleDateString('pt-BR'),
          time: new Date(appointment.scheduled_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: newStatus === 'confirmed' ? 'confirmado' : 'cancelado'
        }),
      });

      if (!response.ok) {
        console.warn('Erro ao enviar email:', await response.text());
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  const updateAppointmentStatus = async (appointment: Appointment, newStatus: 'confirmed' | 'cancelled') => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointment.id)

      if (error) throw error

      // Enviar e-mail após atualizar o status
      const emailSent = await sendStatusEmail(appointment, newStatus)

      setAppointments(appointments.map(app => 
        app.id === appointment.id 
          ? { ...app, status: newStatus }
          : app
      ))

      toast.success(
        `Agendamento ${newStatus === 'confirmed' ? 'confirmado' : 'cancelado'} com sucesso!${
          emailSent ? '' : ' (Falha ao enviar e-mail)'
        }`
      )
      router.refresh()
    } catch (error: any) {
      console.error('Erro:', error)
      toast.error(error.message || 'Erro ao atualizar o agendamento')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    Nenhum agendamento encontrado
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.profile?.full_name || 'Nome não informado'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.profile?.email}
                      </div>
                      {appointment.notes && (
                        <div className="text-xs text-gray-500 mt-1">
                          {appointment.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(appointment.scheduled_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appointment.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'confirmed'
                          ? 'Confirmado'
                          : appointment.status === 'cancelled'
                          ? 'Cancelado'
                          : 'Pendente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateAppointmentStatus(appointment, 'confirmed')}
                            disabled={loading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment, 'cancelled')}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 