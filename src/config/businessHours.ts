export const businessHours = {
  // Horários de funcionamento por dia da semana (0 = Domingo, 1 = Segunda, etc)
  weekdays: {
    0: { isOpen: false }, // Domingo
    1: { // Segunda
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    },
    2: { // Terça
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    },
    3: { // Quarta
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    },
    4: { // Quinta
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    },
    5: { // Sexta
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    },
    6: { // Sábado
      isOpen: true,
      hours: {
        start: '09:00',
        end: '17:00',
        lunchBreak: {
          start: '12:00',
          end: '13:00'
        }
      }
    }
  },
  
  // Duração padrão de cada slot de agendamento em minutos
  slotDuration: 30,
  
  // Feriados ou dias especiais (formato: 'YYYY-MM-DD')
  holidays: [
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
} 