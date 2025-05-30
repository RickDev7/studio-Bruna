export interface DayConfig {
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
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  2: { // Terça
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  3: { // Quarta
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  4: { // Quinta
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  5: { // Sexta
    isOpen: true,
    periods: [
      { start: '09:00', end: '13:00' },
      { start: '14:00', end: '18:00' }
    ]
  },
  6: { // Sábado
    isOpen: true,
    periods: [
      { start: '09:00', end: '14:00' }
    ]
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

// Função auxiliar para converter horário em minutos
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Função auxiliar para converter minutos em horário formatado
function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

// Função para verificar se um horário está dentro do horário de funcionamento
export function isWithinBusinessHours(time: string, dayConfig: DayConfig): boolean {
  if (!dayConfig.isOpen || !dayConfig.periods.length) return false;

  const timeInMinutes = timeToMinutes(time);

  return dayConfig.periods.some(period => {
    const startInMinutes = timeToMinutes(period.start);
    const endInMinutes = timeToMinutes(period.end);
    return timeInMinutes >= startInMinutes && timeInMinutes <= endInMinutes;
  });
}

// Função para gerar os horários disponíveis para um dia específico
export function generateTimeSlots(dayConfig: DayConfig): string[] {
  if (!dayConfig.isOpen || !dayConfig.periods.length) {
    console.log('Estabelecimento fechado ou sem períodos definidos');
    return [];
  }

  const slots: string[] = [];
  const interval = 30; // intervalo em minutos

  dayConfig.periods.forEach(period => {
    try {
      const startMinutes = timeToMinutes(period.start);
      const endMinutes = timeToMinutes(period.end);
      
      console.log(`Gerando slots para período: ${period.start} - ${period.end}`);
      console.log(`Minutos: ${startMinutes} - ${endMinutes}`);

      for (let currentMinutes = startMinutes; currentMinutes <= endMinutes; currentMinutes += interval) {
        const timeSlot = minutesToTime(currentMinutes);
        console.log(`Adicionando slot: ${timeSlot}`);
        slots.push(timeSlot);
      }
    } catch (error) {
      console.error(`Erro ao gerar slots para período ${period.start} - ${period.end}:`, error);
    }
  });

  console.log(`Total de slots gerados: ${slots.length}`);
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