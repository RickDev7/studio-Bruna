import React from 'react';
import { Clock } from 'lucide-react';

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

  return (
    <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-[#FFB6C1] shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-[#FF69B4]" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Horário Selecionado</h3>
            <p className="text-gray-600">
              {formatDate(selectedDate)} às {selectedTime.replace(':', 'h')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 