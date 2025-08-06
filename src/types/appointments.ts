export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'cash' | 'card' | 'pix' | 'transfer';
export type ReminderStatus = 'pending' | 'sent' | 'failed';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: 'admin' | 'user';
}

export interface Appointment {
  id: string;
  user_id: string;
  service: string;
  scheduled_at: string;
  status: AppointmentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export interface CreateAppointmentData {
  service: string;
  date: string;
  time: string;
  notes?: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  profile_id: string;
}

export interface AppointmentHistory {
  id: string;
  appointment_id: string;
  created_at: string;
  action: 'created' | 'updated' | 'deleted';
  old_status?: AppointmentStatus;
  new_status?: AppointmentStatus;
  old_scheduled_at?: string;
  new_scheduled_at?: string;
  notes?: string;
  changed_by: string;
}

export interface Reminder {
  id: string;
  appointment_id: string;
  scheduled_for: string;
  sent_at?: string;
  status: ReminderStatus;
  error_message?: string;
}

export interface MonthlyReport {
  month: string;
  total_appointments: number;
  completed_appointments: number;
  cancelled_appointments: number;
  total_revenue: number;
  unique_clients: number;
}

export interface RescheduleAppointmentData {
  appointment_id: string;
  new_date: string;
  new_time: string;
  notes?: string;
}

export interface CancelAppointmentData {
  appointment_id: string;
  cancellation_reason: string;
} 