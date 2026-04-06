import React from 'react'
import { FreshaButton } from '@/components/FreshaButton'

export function CTASection() {
  return (
    <section className="bg-[var(--text-main)] py-20">
      <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Luxury Booking</p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-[var(--bg-primary)] sm:text-5xl">
          Reservieren Sie Ihren Pflegemoment
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--bg-primary)]/85 sm:text-base">
          Buchung über WhatsApp, Instagram und Fresha. Bestätigung mit 30% Anzahlung.
        </p>
        <div className="mx-auto mt-8 h-px w-24 bg-[var(--gold)]" />
        <div className="mt-8">
          <FreshaButton
            size="lg"
            className="mx-auto w-full max-w-xs !bg-[var(--gold)] !text-[var(--text-main)] hover:!bg-[var(--highlight-soft)]"
          >
            Jetzt buchen
          </FreshaButton>
        </div>
      </div>
    </section>
  )
}
