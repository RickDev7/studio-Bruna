import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { 
  Appointment, 
  AppointmentHistory, 
  RescheduleAppointmentData, 
  CancelAppointmentData,
  MonthlyReport
} from '@/types/appointments';

interface UseAppointmentManagerProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useAppointmentManager({ onSuccess, onError }: UseAppointmentManagerProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const cancelAppointment = async (appointment: Appointment, reason: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', notes: reason })
        .eq('id', appointment.id);

      if (updateError) throw updateError;

      // Enviar email de cancelamento
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
          status: 'cancelado'
        }),
      });

      if (!response.ok) {
        console.warn('Erro ao enviar email de cancelamento:', await response.text());
      }

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro ao cancelar o agendamento';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const rescheduleAppointment = async (data: RescheduleAppointmentData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Buscar o agendamento atual
      const { data: appointment, error: fetchError } = await supabase
        .from('appointments')
        .select('*, profiles(full_name, email)')
        .eq('id', data.appointment_id)
        .single();

      if (fetchError) throw fetchError;

      // Atualizar o agendamento
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          date: data.new_date,
          time: data.new_time,
          status: 'confirmed',
          notes: data.notes || 'Reagendado'
        })
        .eq('id', data.appointment_id);

      if (updateError) throw updateError;

      // Enviar email de reagendamento
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: appointment.profiles.full_name || 'Cliente',
          userEmail: appointment.profiles.email,
          service: appointment.service,
          date: data.new_date,
          time: data.new_time,
          status: 'reagendado'
        }),
      });

      if (!response.ok) {
        console.warn('Erro ao enviar email de reagendamento:', await response.text());
      }

      onSuccess?.();
    } catch (err: any) {
      const errorMessage = err.message || 'Ocorreu um erro ao reagendar';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar histórico de um agendamento
  const getAppointmentHistory = async (appointment_id: string) => {
    try {
      const { data, error } = await supabase
        .from('appointment_history')
        .select('*')
        .eq('appointment_id', appointment_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AppointmentHistory[];
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar histórico');
      return [];
    }
  };

  // Função para buscar relatório mensal
  const getMonthlyReport = async (month: string) => {
    try {
      const { data, error } = await supabase
        .from('appointment_reports')
        .select('*')
        .eq('month', month)
        .single();

      if (error) throw error;
      return data as MonthlyReport;
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar relatório');
      return null;
    }
  };

  // Função para buscar histórico de agendamentos do cliente
  const getClientHistory = async (user_id: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user_id)
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Appointment[];
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar histórico do cliente');
      return [];
    }
  };

  return {
    cancelAppointment,
    rescheduleAppointment,
    getAppointmentHistory,
    getMonthlyReport,
    getClientHistory,
    isLoading,
    error
  };
} 