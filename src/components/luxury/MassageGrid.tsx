'use client'

import { Hand, Droplets, Flower2 } from 'lucide-react'
import { ServiceCategoryGrid, type ServiceEntry } from './ServiceCategoryGrid'

const MASSAGE_SERVICES: ServiceEntry[] = [
  {
    id: 'koerperformend',
    nameDE: 'KÖRPERFORMENDE MASSAGE',
    icon: Hand,
    names: {
      de: 'Körperformende Massage (30 Min)',
      pt: 'Massagem Modeladora Localizada (30 Min)',
      en: 'Body Contouring Massage (30 min)',
      es: 'Masaje Modelador Corporal (30 min)',
    },
    descKey: 'luxury.svc.bodyMassage',
    fromPrice: '35€',
    variants: {
      de: [{ label: 'Körperformende Massage (30 Min)', price: '35€' }],
      pt: [{ label: 'Massagem Modeladora Localizada (30 Min)', price: '35€' }],
      en: [{ label: 'Body Contouring Massage (30 min)', price: '35€' }],
      es: [{ label: 'Masaje Modelador Corporal (30 min)', price: '35€' }],
    },
  },
  {
    id: 'lymphdrainage',
    nameDE: 'LYMPHDRAINAGE',
    icon: Droplets,
    names: {
      de: 'Lymphdrainage',
      pt: 'Drenagem Linfática',
      en: 'Lymphatic Drainage',
      es: 'Drenaje Linfático',
    },
    descKey: 'luxury.svc.lymphDrainage',
    fromPrice: '45€',
    variants: {
      de: [{ label: 'Lymphdrainage', price: '45€' }],
      pt: [{ label: 'Drenagem Linfática', price: '45€' }],
      en: [{ label: 'Lymphatic Drainage', price: '45€' }],
      es: [{ label: 'Drenaje Linfático', price: '45€' }],
    },
  },
  {
    id: 'teilmassage-relax',
    nameDE: 'TEILMASSAGE RELAX',
    icon: Flower2,
    names: {
      de: 'Teilmassage Relax (30 Min)',
      pt: 'Massagem de Relaxamento (30 Min)',
      en: 'Relax Part Massage (30 min)',
      es: 'Masaje Parcial Relax (30 min)',
    },
    descKey: 'luxury.svc.relaxMassage',
    fromPrice: '30€',
    variants: {
      de: [{ label: 'Teilmassage Relax (30 Min)', price: '30€' }],
      pt: [{ label: 'Massagem de Relaxamento (30 Min)', price: '30€' }],
      en: [{ label: 'Relax Part Massage (30 min)', price: '30€' }],
      es: [{ label: 'Masaje Parcial Relax (30 min)', price: '30€' }],
    },
  },
]

export function MassageGrid() {
  return <ServiceCategoryGrid services={MASSAGE_SERVICES} />
}
