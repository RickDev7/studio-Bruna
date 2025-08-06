import { useCallback } from 'react'
import { createClient } from '@/config/supabase-client'
import { Database } from '@/lib/database.types'
import { sendAppointmentEmail } from '@/services/emailService'

interface UseAppointmentProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface CreateAppointmentData {
  service: string
  date: string
  time: string
  notes: string
  user_name: string
  user_email: string
  user_phone: string
}

export function useAppointment({ onSuccess, onError }: UseAppointmentProps = {}) {
  const createAppointment = useCallback(async (data: CreateAppointmentData) => {
    try {
      const supabase = createClient()
      
      // Combinar data e hora em um único timestamp
      const scheduled_at = new Date(`${data.date}T${data.time}`);
      
      const { error } = await supabase
        .from('appointments')
        .insert([
          {
            service_id: data.service,
            scheduled_at,
            notes: data.notes,
            user_name: data.user_name,
            user_email: data.user_email,
            user_phone: data.user_phone,
            status: 'pending'
          }
        ])

      if (error) throw error

      // Enviar emails de confirmação
      const emailResult = await sendAppointmentEmail({
        userName: data.user_name,
        userEmail: data.user_email,
        service: data.service,
        date: data.date,
        time: data.time,
        status: 'pending'
      })

      if (!emailResult.success) {
        console.warn('Erro ao enviar emails:', emailResult.error)
      }

      onSuccess?.()
    } catch (error) {
      console.error('Erro ao criar agendamento:', error)
      onError?.(error instanceof Error ? error.message : 'Erro ao criar agendamento')
    }
  }, [onSuccess, onError])

  return { createAppointment }
} 