'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Props {
  onDone: () => void
}

export function SplashScreen({ onDone }: Props) {
  const { t } = useLanguage()
  const [leaving, setLeaving] = useState(false)

  // Allow pressing Enter or Space to dismiss
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') handleEnter()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleEnter() {
    if (leaving) return
    setLeaving(true)
  }

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F5F1EC]"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, rgba(200,162,122,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(200,162,122,0.05) 0%, transparent 55%)',
          }}
        >
          {/* thin gold top line */}
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8A27A] to-transparent" />

          {/* content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
            className="flex flex-col items-center gap-8 px-6 text-center"
          >
            {/* logo */}
            <div className="relative h-72 w-96 sm:h-80 sm:w-[30rem]">
              <Image
                src="/images/logo-bruna-silva-splash.png"
                alt="Bruna Silva Aesthetic & Nails"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-[#C8A27A]"
            >
              {t('splash.tagline')}
            </motion.p>

            {/* sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              className="font-display text-[1.05rem] italic text-[#8A5C4A]/70"
            >
              {t('splash.sub')}
            </motion.p>

            {/* enter button */}
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.85 }}
              onClick={handleEnter}
              className="group relative mt-2 inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-[#C8A27A] px-8 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[#8A5C4A] transition-all duration-300 hover:bg-[#C8A27A] hover:text-white"
            >
              {/* shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <span className="relative">{t('splash.enter')}</span>
              <svg
                className="relative h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </motion.div>

          {/* thin gold bottom line */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#C8A27A] to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
