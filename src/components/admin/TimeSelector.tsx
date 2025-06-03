import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const timeSlots = [
  { period: 'Manhã', slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30'] },
  { period: 'Tarde', slots: ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] }
];

export function TimeSelector({ selectedTime, onTimeSelect }: TimeSelectorProps) {
  return (
    <div className="space-y-6">
      {timeSlots.map(({ period, slots }) => (
        <div key={period}>
          <h4 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#FF69B4]" />
            <span>{period}</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {slots.map(time => {
              const isSelected = selectedTime === time;
              
              return (
                <button
                  type="button"
                  key={time}
                  onClick={() => onTimeSelect(time)}
                  className={`
                    relative p-3 rounded-lg text-sm font-medium
                    transition-all duration-200 group
                    ${isSelected
                      ? 'bg-[#FF69B4] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-pink-50'}
                  `}
                  aria-pressed={isSelected}
                >
                  {time}
                  
                  {/* Efeito de hover */}
                  <div className={`
                    absolute inset-0 rounded-lg border-2 border-[#FF69B4] opacity-0
                    group-hover:opacity-100 transition-opacity duration-200
                    pointer-events-none
                    ${isSelected ? 'opacity-100' : ''}
                  `} />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 