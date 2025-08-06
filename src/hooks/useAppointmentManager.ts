import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import emailjs from '@emailjs/browser';
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

const EMAIL_CONFIG = {
  serviceId: 'service_qe1ai6q',
  templateId: 'template_gx390pv',
  publicKey: 'N1LpI9fHAIo0az4XG',
} as const;

export function useAppointmentManager({ onSuccess, onError }: UseAppointmentManagerProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  // Inicializa o EmailJS
  useEffect(() => {
    emailjs.init({
      publicKey: EMAIL_CONFIG.publicKey,
      limitRate: {
        throttle: 2000,
      },
    });
  }, []);

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
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        {
          to_name: appointment.profiles.full_name || 'Cliente',
          to_email: appointment.profiles.email,
          service_name: appointment.service,
          appointment_date: new Date(appointment.scheduled_at).toLocaleDateString(),
          appointment_time: new Date(appointment.scheduled_at).toLocaleTimeString(),
          appointment_status: 'cancelado',
        },
        EMAIL_CONFIG.publicKey
      );

      if (response.status !== 200) {
        console.warn('Erro ao enviar email de cancelamento:', response);
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

      // Combinar nova data e hora em um único timestamp
      const scheduled_at = new Date(`${data.new_date}T${data.new_time}`);

      // Atualizar o agendamento
      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          scheduled_at,
          status: 'confirmed',
          notes: data.notes || 'Reagendado'
        })
        .eq('id', data.appointment_id);

      if (updateError) throw updateError;

      // Enviar email de reagendamento
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        {
          to_name: appointment.profiles.full_name || 'Cliente',
          to_email: appointment.profiles.email,
          service_name: appointment.service,
          appointment_date: data.new_date,
          appointment_time: data.new_time,
          appointment_status: 'reagendado',
        },
        EMAIL_CONFIG.publicKey
      );

      if (response.status !== 200) {
        console.warn('Erro ao enviar email de reagendamento:', response);
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
        .order('scheduled_at', { ascending: false });

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