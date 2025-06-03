import { Calendar, Clock, User, Sparkles } from 'lucide-react';

interface BookingStepsProps {
  currentStep: number;
}

const steps = [
  {
    title: 'Serviço',
    icon: Sparkles,
    description: 'Selecione o serviço desejado'
  },
  {
    title: 'Data',
    icon: Calendar,
    description: 'Escolha a data do agendamento'
  },
  {
    title: 'Horário',
    icon: Clock,
    description: 'Defina o horário da sessão'
  },
  {
    title: 'Cliente',
    icon: User,
    description: 'Informe os dados do cliente'
  }
];

export function BookingSteps({ currentStep }: BookingStepsProps) {
  return (
    <div className="w-full py-4 px-2 mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.title} className="flex flex-col items-center flex-1">
              {/* Linha conectora */}
              {index > 0 && (
                <div className="hidden sm:block absolute h-[2px] top-[2.25rem] -left-1/2 w-full bg-gray-200">
                  <div 
                    className="h-full bg-[#FF69B4] transition-all duration-300"
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}

              {/* Ícone e número da etapa */}
              <div className="relative">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  transition-all duration-300
                  ${isActive || isCompleted
                    ? 'bg-[#FF69B4] text-white'
                    : 'bg-gray-100 text-gray-400'}
                `}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Título e descrição */}
              <div className="mt-2 text-center">
                <p className={`
                  font-medium transition-colors duration-300
                  ${isActive ? 'text-[#FF69B4]' : 'text-gray-500'}
                `}>
                  {step.title}
                </p>
                <p className="hidden sm:block text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 