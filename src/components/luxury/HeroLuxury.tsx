import React from 'react'
import Image from 'next/image'
import { FreshaButton } from '@/components/FreshaButton'

export function HeroLuxury() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />
      <div className="absolute inset-0">
        <Image
          src="/images/banner-bruna-silva-original.png"
          alt="Bruna Silva - Aesthetic & Nails"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover opacity-20"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)]/75 via-[var(--highlight-soft)]/20 to-[var(--bg-primary)]/60" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-fadeIn">
          <div className="mb-6 h-px w-20 bg-[var(--gold)]" />
          <h1 className="text-4xl font-semibold leading-tight text-[var(--text-main)] sm:text-5xl md:text-6xl">
            Schönheit mit Eleganz und Exklusivität
          </h1>
          <p className="mt-5 max-w-2xl text-base text-[var(--text-main)]/85 sm:text-lg">
            Ein Ort, der ganz Ihrer Pflege und Ihrem Wohlbefinden gewidmet ist
          </p>
          <div className="mt-8">
            <FreshaButton
              size="lg"
              className="w-full sm:w-auto !bg-[var(--accent-medium)] !text-[var(--bg-primary)] hover:!bg-[var(--text-main)]"
            >
              Behandlung buchen
            </FreshaButton>
          </div>
        </div>
      </div>
    </section>
  )
}
