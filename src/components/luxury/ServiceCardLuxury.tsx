import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ServiceCardLuxuryProps {
  icon: LucideIcon
  title: string
  description: string
  fromPrice: string
}

export function ServiceCardLuxury({
  icon: Icon,
  title,
  description,
  fromPrice,
}: ServiceCardLuxuryProps) {
  return (
    <article className="rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-primary)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--highlight-soft)]">
        <Icon className="h-5 w-5 text-[var(--gold)]" />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--text-main)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-main)]/80">{description}</p>
      <p className="mt-4 text-sm font-medium text-[var(--gold)]">A partir de {fromPrice}</p>
      <Link
        href="/servicos"
        className="mt-5 inline-flex rounded-full border border-[var(--accent-soft)] bg-[var(--bg-secondary)] px-4 py-2 text-sm font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--accent-soft)]"
      >
        Ver mais
      </Link>
    </article>
  )
}
