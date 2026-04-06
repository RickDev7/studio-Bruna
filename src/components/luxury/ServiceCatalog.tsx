'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Eye, Droplets, Scissors, Hand, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { NailServicesGrid } from './NailServicesGrid'
import { BrowsGrid } from './BrowsGrid'
import { FacialGrid } from './FacialGrid'
import { DepilationGrid } from './DepilationGrid'
import { MassageGrid } from './MassageGrid'

type CategoryId = 'nails' | 'brows' | 'facial' | 'depil' | 'massage'

interface CategoryDef {
  id: CategoryId
  icon: React.ElementType
  titleKey: string
  subKey: string
  fromPrice: string
  accentColor: string
}

const CATEGORIES: CategoryDef[] = [
  {
    id: 'nails',
    icon: Sparkles,
    titleKey: 'luxury.cats.nails',
    subKey: 'luxury.cats.nailsSub',
    fromPrice: '18€',
    accentColor: '#C8A27A',
  },
  {
    id: 'brows',
    icon: Eye,
    titleKey: 'luxury.cats.brows',
    subKey: 'luxury.cats.browsSub',
    fromPrice: '18€',
    accentColor: '#C8A27A',
  },
  {
    id: 'facial',
    icon: Droplets,
    titleKey: 'luxury.cats.face',
    subKey: 'luxury.cats.faceSub',
    fromPrice: '32€',
    accentColor: '#C8A27A',
  },
  {
    id: 'depil',
    icon: Scissors,
    titleKey: 'luxury.cats.depil',
    subKey: 'luxury.cats.depilSub',
    fromPrice: '10€',
    accentColor: '#C8A27A',
  },
  {
    id: 'massage',
    icon: Hand,
    titleKey: 'luxury.cats.massage',
    subKey: 'luxury.cats.massageSub',
    fromPrice: '30€',
    accentColor: '#C8A27A',
  },
]

function ModalContent({ id }: { id: CategoryId }) {
  switch (id) {
    case 'nails':   return <NailServicesGrid />
    case 'brows':   return <BrowsGrid />
    case 'facial':  return <FacialGrid />
    case 'depil':   return <DepilationGrid />
    case 'massage': return <MassageGrid />
  }
}

export function ServiceCatalog() {
  const { t } = useLanguage()
  const [open, setOpen] = useState<CategoryId | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const activeCategory = CATEGORIES.find((c) => c.id === open)

  return (
    <>
      {/* ── 5 category cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <motion.button
              key={cat.id}
              onClick={() => setOpen(cat.id)}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-[#E5D9CC] bg-white px-4 py-8 text-center shadow-sm transition-shadow duration-200 hover:border-[#C8A27A] hover:shadow-[0_8px_28px_rgba(200,162,122,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A27A]"
            >
              {/* hover gold top bar */}
              <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#C8A27A] via-[#E8D5BC] to-[#C8A27A] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

              {/* icon circle */}
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F5F1EC] ring-1 ring-[#E5D9CC] transition-all duration-200 group-hover:ring-[#C8A27A]/50">
                <Icon className="h-6 w-6 text-[#C8A27A]" strokeWidth={1.5} />
              </span>

              {/* title */}
              <span className="font-display text-[1.2rem] italic leading-tight text-[#2C2C2C]">
                {t(cat.titleKey)}
              </span>

              {/* subtitle */}
              <span className="text-[0.75rem] leading-[1.5] text-[#6B5B4E]/60">
                {t(cat.subKey)}
              </span>

              {/* from price */}
              <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#E5D9CC] bg-[#FAF7F4] px-3 py-1 text-[0.75rem] font-semibold text-[#8A5C4A]">
                {t('luxury.cats.fromPrefix')} {cat.fromPrice}
              </span>

              {/* CTA */}
              <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-[#C8A27A] opacity-0 transition-all duration-200 group-hover:opacity-100">
                {t('luxury.cats.viewBtn')}
                <ArrowRight className="h-3 w-3" />
              </span>
            </motion.button>
          )
        })}
      </div>

      {/* ── Category modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {open && activeCategory && (
          <motion.div
            key="catalog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setOpen(null)}
          >
            <motion.div
              key="catalog-modal"
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-[#F5F1EC] shadow-2xl sm:h-auto sm:max-h-[88vh] sm:rounded-3xl"
            >
              {/* gold stripe */}
              <div className="h-1 w-full shrink-0 bg-gradient-to-r from-[#C8A27A] via-[#E8D5BC] to-[#C8A27A]" />

              {/* modal header */}
              <div className="flex shrink-0 items-center justify-between border-b border-[#E5D9CC] bg-white px-6 py-5">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = activeCategory.icon
                    return (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1EC]">
                        <Icon className="h-5 w-5 text-[#C8A27A]" strokeWidth={1.5} />
                      </span>
                    )
                  })()}
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#C8A27A]">
                      {t('luxury.cats.fromPrefix')} {activeCategory.fromPrice}
                    </p>
                    <h2 className="font-display text-xl italic text-[#2C2C2C]">
                      {t(activeCategory.titleKey)}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setOpen(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F1EC] text-[#8A5C4A] transition-colors hover:bg-[#E5D9CC]"
                  aria-label={t('luxury.nails.close')}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* modal body — scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <ModalContent id={open} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
