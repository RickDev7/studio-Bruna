'use client'

import { Eye, Sparkles, Scissors, Leaf, Zap, Star } from 'lucide-react'
import { ServiceCategoryGrid, type ServiceEntry } from './ServiceCategoryGrid'

const BROWS_SERVICES: ServiceEntry[] = [
  {
    id: 'lash-lifting',
    nameDE: 'LASH LIFTING',
    icon: Eye,
    names: { de: 'Lash Lifting', pt: 'Lifting de Pestanas', en: 'Lash Lifting', es: 'Lifting de Pestañas' },
    descKey: 'luxury.svc.lashLifting',
    fromPrice: '48€',
    variants: {
      de: [{ label: 'Lash Lifting', price: '48€' }],
      pt: [{ label: 'Lifting de Pestanas', price: '48€' }],
      en: [{ label: 'Lash Lifting', price: '48€' }],
      es: [{ label: 'Lifting de Pestañas', price: '48€' }],
    },
  },
  {
    id: 'wimpern-farben',
    nameDE: 'WIMPERN FÄRBEN',
    icon: Star,
    names: { de: 'Wimpern Färben', pt: 'Coloração de Pestanas', en: 'Lash Tinting', es: 'Tinte de Pestañas' },
    descKey: 'luxury.svc.wimpernFarben',
    fromPrice: '18€',
    variants: {
      de: [{ label: 'Wimpern Färben', price: '18€' }],
      pt: [{ label: 'Coloração de Pestanas', price: '18€' }],
      en: [{ label: 'Lash Tinting', price: '18€' }],
      es: [{ label: 'Tinte de Pestañas', price: '18€' }],
    },
  },
  {
    id: 'brow-lamination',
    nameDE: 'BROW LAMINATION',
    icon: Sparkles,
    names: { de: 'Brow Lamination', pt: 'Laminação de Sobrancelhas', en: 'Brow Lamination', es: 'Laminado de Cejas' },
    descKey: 'luxury.svc.browLamination',
    fromPrice: '48€',
    variants: {
      de: [{ label: 'Brow Lamination', price: '48€' }],
      pt: [{ label: 'Laminação de Sobrancelhas', price: '48€' }],
      en: [{ label: 'Brow Lamination', price: '48€' }],
      es: [{ label: 'Laminado de Cejas', price: '48€' }],
    },
  },
  {
    id: 'augenbrauen-design',
    nameDE: 'AUGENBRAUEN DESIGN',
    icon: Scissors,
    names: { de: 'Augenbrauen Design', pt: 'Design de Sobrancelhas', en: 'Brow Design', es: 'Diseño de Cejas' },
    descKey: 'luxury.svc.augenbrauenDesign',
    fromPrice: '22€',
    variants: {
      de: [{ label: 'Augenbrauen Design', price: '22€' }],
      pt: [{ label: 'Design de Sobrancelhas', price: '22€' }],
      en: [{ label: 'Brow Design', price: '22€' }],
      es: [{ label: 'Diseño de Cejas', price: '22€' }],
    },
  },
  {
    id: 'brow-regen',
    nameDE: 'BROW REGENERATION',
    icon: Leaf,
    names: { de: 'Brow Regeneration', pt: 'Regeneração de Sobrancelhas', en: 'Brow Regeneration', es: 'Regeneración de Cejas' },
    descKey: 'luxury.svc.browRegen',
    fromPrice: '59€',
    variants: {
      de: [{ label: 'Brow Regeneration', price: '59€' }],
      pt: [{ label: 'Regeneração de Sobrancelhas', price: '59€' }],
      en: [{ label: 'Brow Regeneration', price: '59€' }],
      es: [{ label: 'Regeneración de Cejas', price: '59€' }],
    },
  },
  {
    id: 'brow-regen-micro',
    nameDE: 'BROW REGEN + MICRONEEDLING',
    icon: Zap,
    names: {
      de: 'Brow Regeneration + Microneedling',
      pt: 'Regeneração + Microagulhamento',
      en: 'Brow Regen + Microneedling',
      es: 'Regeneración + Microagujas',
    },
    descKey: 'luxury.svc.browRegenMicro',
    fromPrice: '70€',
    variants: {
      de: [{ label: 'Brow Regeneration + Microneedling', price: '70€' }],
      pt: [{ label: 'Regeneração + Microagulhamento', price: '70€' }],
      en: [{ label: 'Brow Regen + Microneedling', price: '70€' }],
      es: [{ label: 'Regeneración + Microagujas', price: '70€' }],
    },
  },
]

export function BrowsGrid() {
  return <ServiceCategoryGrid services={BROWS_SERVICES} />
}
