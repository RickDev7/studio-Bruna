'use client'

import { Scissors, Flame } from 'lucide-react'
import { ServiceCategoryGrid, type ServiceEntry } from './ServiceCategoryGrid'

const DEPILATION_SERVICES: ServiceEntry[] = [
  {
    id: 'fadentechnik',
    nameDE: 'FADENTECHNIK',
    icon: Scissors,
    names: {
      de: 'Fadentechnik',
      pt: 'Depilação com Linha',
      en: 'Threading',
      es: 'Depilación con Hilo',
    },
    descKey: 'luxury.svc.fadentechnik',
    fromPrice: '10€',
    variants: {
      de: [
        { label: 'Augenbrauen', price: '18€' },
        { label: 'Oberlippe', price: '10€' },
        { label: 'Kinn', price: '10€' },
        { label: 'Gesicht komplett', price: '45€' },
      ],
      pt: [
        { label: 'Sobrancelhas', price: '18€' },
        { label: 'Buço', price: '10€' },
        { label: 'Queixo', price: '10€' },
        { label: 'Rosto completo', price: '45€' },
      ],
      en: [
        { label: 'Eyebrows', price: '18€' },
        { label: 'Upper Lip', price: '10€' },
        { label: 'Chin', price: '10€' },
        { label: 'Full Face', price: '45€' },
      ],
      es: [
        { label: 'Cejas', price: '18€' },
        { label: 'Labio Superior', price: '10€' },
        { label: 'Mentón', price: '10€' },
        { label: 'Cara Completa', price: '45€' },
      ],
    },
  },
  {
    id: 'wachsdepilation',
    nameDE: 'WACHSDEPILATION',
    icon: Flame,
    names: {
      de: 'Wachsdepilation',
      pt: 'Depilação com Cera',
      en: 'Wax Hair Removal',
      es: 'Depilación con Cera',
    },
    descKey: 'luxury.svc.wachsDepilation',
    fromPrice: '10€',
    variants: {
      de: [
        { label: 'Ganzkörper Premium', price: '90€' },
        { label: 'Ganzkörper', price: '75€' },
        { label: 'Intim Komplett', price: '40€' },
        { label: 'Bikini-Zone', price: '28€' },
        { label: 'Beine Komplett', price: '40€' },
        { label: 'Unterschenkel', price: '25€' },
        { label: 'Achseln', price: '18€' },
        { label: 'Augenbrauen', price: '15€' },
        { label: 'Oberlippe', price: '10€' },
      ],
      pt: [
        { label: 'Completa Premium', price: '90€' },
        { label: 'Completa', price: '75€' },
        { label: 'Virilha Completa', price: '40€' },
        { label: 'Zona Biquini', price: '28€' },
        { label: 'Perna Completa', price: '40€' },
        { label: 'Perna (meia)', price: '25€' },
        { label: 'Axila', price: '18€' },
        { label: 'Sobrancelha', price: '15€' },
        { label: 'Buço', price: '10€' },
      ],
      en: [
        { label: 'Full Body Premium', price: '90€' },
        { label: 'Full Body', price: '75€' },
        { label: 'Full Intimate', price: '40€' },
        { label: 'Bikini Zone', price: '28€' },
        { label: 'Full Legs', price: '40€' },
        { label: 'Lower Legs', price: '25€' },
        { label: 'Underarms', price: '18€' },
        { label: 'Eyebrows', price: '15€' },
        { label: 'Upper Lip', price: '10€' },
      ],
      es: [
        { label: 'Cuerpo Completo Premium', price: '90€' },
        { label: 'Cuerpo Completo', price: '75€' },
        { label: 'Íntimo Completo', price: '40€' },
        { label: 'Zona Bikini', price: '28€' },
        { label: 'Piernas Completas', price: '40€' },
        { label: 'Media Pierna', price: '25€' },
        { label: 'Axilas', price: '18€' },
        { label: 'Cejas', price: '15€' },
        { label: 'Labio Superior', price: '10€' },
      ],
    },
  },
]

export function DepilationGrid() {
  return <ServiceCategoryGrid services={DEPILATION_SERVICES} />
}
