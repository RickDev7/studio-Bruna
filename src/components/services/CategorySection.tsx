import React from 'react'
import { LucideIcon } from 'lucide-react'

interface CategorySectionProps {
  icon: LucideIcon
  title: string
  subtitle: string
  note?: string
  children: React.ReactNode
}

export function CategorySection({
  icon: Icon,
  title,
  subtitle,
  note,
  children,
}: CategorySectionProps) {
  return (
    <section className="rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-primary)] p-6 sm:p-8">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--highlight-soft)]">
          <Icon className="h-5 w-5 text-[var(--gold)]" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-main)]">{title}</h3>
          <p className="text-sm text-[var(--text-main)]/80">{subtitle}</p>
        </div>
      </header>
      {children}
      {note ? (
        <p className="mt-5 rounded-xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] px-4 py-3 text-sm text-[var(--text-main)]">
          {note}
        </p>
      ) : null}
    </section>
  )
}
