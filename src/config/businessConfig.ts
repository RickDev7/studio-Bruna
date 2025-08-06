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

export const businessConfig = {
  contact: {
    phone: '+49 1520 800 7814',
    email: 'bs.aestheticnails@gmail.com',
    whatsapp: '+49 1520 800 7814',
    instagram: 'bs.aesthetic.nails',
    facebook: 'https://www.facebook.com/people/Bruna-Silva-Aesthetic-Nails/61573618850298/',
    address: {
      street: 'Bei der Grodener Kirche 7',
      city: 'Cuxhaven',
      state: 'Niedersachsen',
      country: 'Deutschland',
      postalCode: '27472',
      googleMaps: 'https://maps.app.goo.gl/SFVgUBGxE3Lv7HKKA'
    }
  },
  business: {
    name: 'Bruna Silva - Aesthetic & Nails',
    shortName: 'BS Aesthetic & Nails',
    description: 'Seu espaço de beleza e bem-estar em Cuxhaven',
    currency: 'EUR',
    currencySymbol: '€',
    language: 'pt-BR',
    timezone: 'Europe/Berlin'
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