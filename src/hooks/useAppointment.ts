import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { formatarDataBanco } from '@/utils/formatters';

interface UseAppointmentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface CreateAppointmentData {
  service: string;
  date: string;
  time: string;
  notes: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export function useAppointment({ onSuccess, onError }: UseAppointmentProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const createAppointment = async (data: CreateAppointmentData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Primeiro, criar ou buscar o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.user_email)
        .single();

      let profileId;

      if (profileError) {
        // Se o perfil não existe, criar um novo
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            full_name: data.user_name,
            email: data.user_email,
            phone: data.user_phone,
            role: 'client'
          })
          .select('id')
          .single();

        if (createProfileError) throw createProfileError;
        profileId = newProfile.id;
      } else {
        profileId = profile.id;
      }

      // Combinar data e hora em um único timestamp
      const [year, month, day] = data.date.split('-').map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);
      const scheduled_at = new Date(Date.UTC(year, month - 1, day, hours, minutes));

      // Verificar disponibilidade do horário usando between para evitar problemas de timezone
      const start = new Date(scheduled_at);
      const end = new Date(scheduled_at);
      end.setMinutes(end.getMinutes() + 59);

      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .gte('scheduled_at', start.toISOString())
        .lte('scheduled_at', end.toISOString())
        .eq('status', 'confirmed');

      if (checkError) throw checkError;

      if (existingAppointments && existingAppointments.length > 0) {
        throw new Error('Este horário já está reservado');
      }

      // Criar o agendamento
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          service: data.service,
          date: data.date,
          time: data.time,
          scheduled_at: scheduled_at.toISOString(),
          status: 'confirmed',
          notes: data.notes || '',
          profile_id: profileId,
          created_at: new Date().toISOString(),
          user_id: null // Definindo explicitamente como null já que não estamos usando
        });

      if (appointmentError) throw appointmentError;

      // Enviar email de confirmação
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userName: data.user_name,
            userEmail: data.user_email,
            service: data.service,
            date: data.date,
            time: data.time,
            isAppointmentConfirmation: true
          }),
        });

        if (!response.ok) {
          console.warn('Erro ao enviar email de confirmação:', await response.text());
        }
      } catch (emailError) {
        console.warn('Erro ao enviar email de confirmação:', emailError);
        // Não vamos interromper o fluxo por causa de um erro no email
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      const errorMessage = error.message || 'Ocorreu um erro ao criar o agendamento';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAppointment,
    isLoading,
    error
  };
} 