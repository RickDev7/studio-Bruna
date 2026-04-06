'use client'

import { Droplets, FlaskConical, Zap, Leaf, Heart, Sparkles } from 'lucide-react'
import { ServiceCategoryGrid, type ServiceEntry } from './ServiceCategoryGrid'

const FACIAL_SERVICES: ServiceEntry[] = [
  {
    id: 'tiefenreinigung-classic',
    nameDE: 'KLASSISCHE TIEFENREINIGUNG',
    icon: Droplets,
    names: {
      de: 'Klassische Tiefenreinigung',
      pt: 'Limpeza de Pele',
      en: 'Classic Deep Cleansing',
      es: 'Limpieza Profunda Clásica',
    },
    descKey: 'luxury.svc.tiefenClass',
    fromPrice: '60€',
    variants: {
      de: [{ label: 'Klassische Tiefenreinigung', price: '60€' }],
      pt: [{ label: 'Limpeza de Pele', price: '60€' }],
      en: [{ label: 'Classic Deep Cleansing', price: '60€' }],
      es: [{ label: 'Limpieza Profunda Clásica', price: '60€' }],
    },
  },
  {
    id: 'tiefenreinigung-intensiv',
    nameDE: 'INTENSIVE TIEFENREINIGUNG',
    icon: FlaskConical,
    names: {
      de: 'Intensive Tiefenreinigung',
      pt: 'Limpeza de Pele Intensiva',
      en: 'Intensive Deep Cleansing',
      es: 'Limpieza Profunda Intensiva',
    },
    descKey: 'luxury.svc.tiefenIntens',
    fromPrice: '80€',
    variants: {
      de: [{ label: 'Intensive Tiefenreinigung', price: '80€' }],
      pt: [{ label: 'Limpeza de Pele Intensiva', price: '80€' }],
      en: [{ label: 'Intensive Deep Cleansing', price: '80€' }],
      es: [{ label: 'Limpieza Profunda Intensiva', price: '80€' }],
    },
  },
  {
    id: 'microneedling',
    nameDE: 'MICRONEEDLING',
    icon: Zap,
    names: {
      de: 'Microneedling',
      pt: 'Microagulhamento',
      en: 'Microneedling',
      es: 'Microagujas',
    },
    descKey: 'luxury.svc.microneedling',
    fromPrice: '80€',
    variants: {
      de: [{ label: 'Microneedling', price: '80€' }],
      pt: [{ label: 'Microagulhamento', price: '80€' }],
      en: [{ label: 'Microneedling', price: '80€' }],
      es: [{ label: 'Microagujas', price: '80€' }],
    },
  },
  {
    id: 'aha-peeling',
    nameDE: 'AHA PEELING',
    icon: Leaf,
    names: {
      de: 'AHA Peeling',
      pt: 'Peeling Químico',
      en: 'AHA Chemical Peel',
      es: 'Peeling Químico AHA',
    },
    descKey: 'luxury.svc.ahaPeeling',
    fromPrice: '80€',
    variants: {
      de: [{ label: 'AHA Peeling', price: '80€' }],
      pt: [{ label: 'Peeling Químico', price: '80€' }],
      en: [{ label: 'AHA Chemical Peel', price: '80€' }],
      es: [{ label: 'Peeling Químico AHA', price: '80€' }],
    },
  },
  {
    id: 'hydra-lips-basic',
    nameDE: 'HYDRA LIPS BASIC',
    icon: Heart,
    names: {
      de: 'Hydra Lips Basic',
      pt: 'Hidratação Labial Basic',
      en: 'Hydra Lips Basic',
      es: 'Hidratación Labial Basic',
    },
    descKey: 'luxury.svc.hydraBasic',
    fromPrice: '32€',
    variants: {
      de: [{ label: 'Hydra Lips Basic', price: '32€' }],
      pt: [{ label: 'Hidratação Labial Basic', price: '32€' }],
      en: [{ label: 'Hydra Lips Basic', price: '32€' }],
      es: [{ label: 'Hidratación Labial Basic', price: '32€' }],
    },
  },
  {
    id: 'hydra-lips-pro',
    nameDE: 'HYDRA LIPS PRO',
    icon: Sparkles,
    names: {
      de: 'Hydra Lips Pro (mit Microneedling)',
      pt: 'Hydra Lips Pro (com Microagulhamento)',
      en: 'Hydra Lips Pro (with Microneedling)',
      es: 'Hydra Lips Pro (con Microagujas)',
    },
    descKey: 'luxury.svc.hydraPro',
    fromPrice: '65€',
    variants: {
      de: [{ label: 'Hydra Lips Pro + Microneedling', price: '65€' }],
      pt: [{ label: 'Hydra Lips Pro + Microagulhamento', price: '65€' }],
      en: [{ label: 'Hydra Lips Pro + Microneedling', price: '65€' }],
      es: [{ label: 'Hydra Lips Pro + Microagujas', price: '65€' }],
    },
  },
]

export function FacialGrid() {
  return <ServiceCategoryGrid services={FACIAL_SERVICES} />
}
