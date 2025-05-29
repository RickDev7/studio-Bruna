interface DayConfig {
  isOpen: boolean;
  periods: { start: string; end: string }[];
}

interface BusinessHours {
  [key: number]: DayConfig;
}

export const businessHours: BusinessHours = {
  0: { // Domingo
    isOpen: false,
    periods: []
  },
  1: { // Segunda
    isOpen: true,
    periods: [{ start: '09:00', end: '13:00' }]
  },
  2: { // Terça
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '15:00', end: '18:00' }
    ]
  },
  3: { // Quarta
    isOpen: true,
    periods: [{ start: '09:00', end: '13:00' }]
  },
  4: { // Quinta
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '15:00', end: '18:00' }
    ]
  },
  5: { // Sexta
    isOpen: true,
    periods: [{ start: '09:00', end: '13:00' }]
  },
  6: { // Sábado
    isOpen: true,
    periods: [{ start: '09:30', end: '17:00' }]
  }
};

// Função para verificar se um horário está dentro do intervalo de almoço
export function isLunchBreak(time: string, dayConfig: DayConfig): boolean {
  if (!dayConfig.isOpen || !dayConfig.periods) return false

  const timeInMinutes = timeToMinutes(time)
  const lunchStartInMinutes = timeToMinutes(dayConfig.periods[0].start)
  const lunchEndInMinutes = timeToMinutes(dayConfig.periods[0].end)

  return timeInMinutes >= lunchStartInMinutes && timeInMinutes < lunchEndInMinutes
}

// Função para verificar se um horário está dentro do horário de funcionamento
export function isWithinBusinessHours(time: string, dayConfig: DayConfig): boolean {
  if (!dayConfig.isOpen || !dayConfig.periods) return false

  const timeInMinutes = timeToMinutes(time)
  const startInMinutes = timeToMinutes(dayConfig.periods[0].start)
  const endInMinutes = timeToMinutes(dayConfig.periods[0].end)

  return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes
}

// Função auxiliar para converter horário em minutos
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Função para gerar os horários disponíveis para um dia específico
export function generateTimeSlots(dayConfig: DayConfig): string[] {
  if (!dayConfig.isOpen) return [];

  const slots: string[] = [];
  const interval = 30; // intervalo em minutos

  dayConfig.periods.forEach(period => {
    const [startHour, startMinute] = period.start.split(':').map(Number);
    const [endHour, endMinute] = period.end.split(':').map(Number);
    
    const currentTime = new Date();
    currentTime.setHours(startHour, startMinute, 0);
    
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    while (currentTime < endTime) {
      slots.push(
        `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`
      );
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
  });

  return slots;
}

// Duração padrão de cada slot de agendamento em minutos
export const slotDuration = 30

// Feriados ou dias especiais (formato: 'YYYY-MM-DD')
export const holidays = [
  '2024-12-25', // Natal
  '2024-12-31', // Ano Novo
  '2024-01-01', // Confraternização Universal
  '2024-02-12', // Carnaval
  '2024-02-13', // Carnaval
  '2024-03-29', // Sexta-feira Santa
  '2024-04-21', // Tiradentes
  '2024-05-01', // Dia do Trabalho
  '2024-06-20', // Corpus Christi
  '2024-09-07', // Independência
  '2024-10-12', // Nossa Senhora Aparecida
  '2024-11-02', // Finados
  '2024-11-15', // Proclamação da República
] 