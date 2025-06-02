interface BusinessHours {
  start: string
  end: string
  lunchStart?: string
  lunchEnd?: string
}

interface BusinessConfig {
  name: string
  address: string
  phone: string
  email: string
  businessHours: {
    [key: string]: BusinessHours
  }
}

export const businessConfig: BusinessConfig = {
  name: 'Studio Bruna',
  address: 'Endereço do Studio',
  phone: 'Telefone do Studio',
  email: 'bs.aestheticnails@gmail.com',
  businessHours: {
    monday: {
      start: '09:00',
      end: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00'
    },
    tuesday: {
      start: '09:00',
      end: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00'
    },
    wednesday: {
      start: '09:00',
      end: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00'
    },
    thursday: {
      start: '09:00',
      end: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00'
    },
    friday: {
      start: '09:00',
      end: '18:00',
      lunchStart: '13:00',
      lunchEnd: '14:00'
    },
    saturday: {
      start: '09:00',
      end: '14:00'
    },
    sunday: {
      start: '',
      end: ''
    }
  }
}

export const weekDays = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
} 