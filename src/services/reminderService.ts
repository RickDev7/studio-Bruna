import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Reminder, Appointment } from '@/types/appointments';
import { resendConfig } from '@/config/resend';

class ReminderService {
  private supabase = createClientComponentClient();

  // Agendar lembretes para um agendamento
  async scheduleReminders(appointment: Appointment) {
    try {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      
      // Agendar lembrete por email para 24h antes
      const reminder = {
        appointment_id: appointment.id,
        scheduled_for: new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending' as const
      };

      // Inserir lembrete no banco
      const { error } = await this.supabase
        .from('reminders')
        .insert([reminder]);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao agendar lembretes:', error);
      throw error;
    }
  }

  // Processar lembretes pendentes
  async processReminders() {
    try {
      // Buscar lembretes pendentes que já devem ser enviados
      const { data: pendingReminders, error } = await this.supabase
        .from('reminders')
        .select('*, appointments(*)')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString());

      if (error) throw error;

      // Processar cada lembrete
      for (const reminder of pendingReminders || []) {
        try {
          const appointment = reminder.appointments as Appointment;

          // Enviar email de lembrete
          await this.sendReminder(reminder, {
            userName: appointment.user_name,
            userEmail: appointment.user_email,
            service: appointment.service,
            date: appointment.date,
            time: appointment.time
          });

          // Atualizar status do lembrete
          await this.supabase
            .from('reminders')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', reminder.id);

        } catch (err: any) {
          // Em caso de erro, marcar o lembrete como falho
          await this.supabase
            .from('reminders')
            .update({
              status: 'failed',
              error_message: err.message
            })
            .eq('id', reminder.id);
        }
      }
    } catch (error) {
      console.error('Erro ao processar lembretes:', error);
      throw error;
    }
  }

  // Reagendar lembretes para um agendamento
  async rescheduleReminders(appointment: Appointment) {
    try {
      // Cancelar lembretes existentes
      await this.supabase
        .from('reminders')
        .update({ status: 'cancelled' })
        .eq('appointment_id', appointment.id);

      // Agendar novos lembretes
      await this.scheduleReminders(appointment);
    } catch (error) {
      console.error('Erro ao reagendar lembretes:', error);
      throw error;
    }
  }

  async sendReminder(reminder: Reminder, appointmentDetails: {
    userName: string;
    userEmail: string;
    service: string;
    date: string;
    time: string;
  }) {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...appointmentDetails,
          isReminder: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar lembrete');
      }

      return { success: true };
    } catch (error) {
      console.error('Erro ao enviar lembrete:', error);
      return { success: false, error };
    }
  }
}

export const reminderService = new ReminderService(); 