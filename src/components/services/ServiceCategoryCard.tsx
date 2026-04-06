import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ServiceItem {
  name: string
  price: string
}

interface ServiceCategoryCardProps {
  icon: LucideIcon
  titlePt: string
  titleDe: string
  items: ServiceItem[]
  note?: string
}

export function ServiceCategoryCard({
  icon: Icon,
  titlePt,
  titleDe,
  items,
  note,
}: ServiceCategoryCardProps) {
  return (
    <article className="rounded-3xl border border-[var(--accent-soft)] bg-[var(--bg-primary)] p-6 shadow-sm">
      <header className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--highlight-soft)]">
          <Icon className="h-5 w-5 text-[var(--gold)]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-main)]">{titlePt}</h3>
          <p className="text-sm text-[var(--text-main)]/80">{titleDe}</p>
        </div>
      </header>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={`${titlePt}-${item.name}`}
            className="flex items-center justify-between gap-4 border-b border-[var(--accent-soft)]/60 pb-2"
          >
            <span className="text-sm text-[var(--text-main)]">{item.name}</span>
            <span className="text-sm font-semibold text-[var(--gold)]">{item.price}</span>
          </li>
        ))}
      </ul>

      {note ? (
        <p className="mt-4 rounded-xl bg-[var(--bg-secondary)] px-3 py-2 text-xs text-[var(--text-main)]">
          {note}
        </p>
      ) : null}
    </article>
  )
}
