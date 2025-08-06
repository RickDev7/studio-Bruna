import React from 'react';
import { Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { businessHours } from '@/config/businessHours';

interface SelectedTimeDisplayProps {
  selectedTime: string;
  selectedDate: Date;
}

export function SelectedTimeDisplay({ selectedTime, selectedDate }: SelectedTimeDisplayProps) {
  if (!selectedTime) return null;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (time: string) => {
    return time.replace(':', 'h');
  };

  const getDayPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return 'manhã';
    if (hour >= 12 && hour < 18) return 'tarde';
    return 'noite';
  };

  const getNextTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + 30;
    const nextHours = Math.floor(totalMinutes / 60);
    const nextMinutes = totalMinutes % 60;
    return `${String(nextHours).padStart(2, '0')}:${String(nextMinutes).padStart(2, '0')}`;
  };

  const dayOfWeek = selectedDate.getDay();
  const dayConfig = businessHours[dayOfWeek];
  const nextTime = getNextTimeSlot(selectedTime);

  return (
    <div className="mt-6 bg-gradient-to-br from-white to-pink-50/30 backdrop-blur-sm rounded-2xl p-6 border border-[#FFB6C1] shadow-sm">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="bg-pink-100 rounded-full p-3">
            <Clock className="w-6 h-6 text-[#FF69B4]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Horário Selecionado</h3>
            <p className="text-gray-600 mt-1">
              Período da {getDayPeriod(selectedTime)} - {formatTime(selectedTime)} às {formatTime(nextTime)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-pink-100 rounded-full p-3">
            <Calendar className="w-6 h-6 text-[#FF69B4]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Data do Agendamento</h3>
            <p className="text-gray-600 mt-1 capitalize">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-pink-100 rounded-full p-3">
            <Check className="w-6 h-6 text-[#FF69B4]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Confirmação</h3>
            <p className="text-gray-600 mt-1">
              Horário disponível para agendamento
            </p>
          </div>
        </div>

        <div className="mt-4 bg-pink-50/50 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-[#FF69B4] flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-gray-600">
            <p>
              Chegue com 5-10 minutos de antecedência para garantir o melhor atendimento.
              Em caso de imprevisto, entre em contato conosco com pelo menos 2 horas de antecedência.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 