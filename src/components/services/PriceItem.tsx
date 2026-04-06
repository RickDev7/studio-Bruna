import React from 'react'

interface PriceItemProps {
  label: string
  price: string
  description?: string
}

export function PriceItem({ label, price, description }: PriceItemProps) {
  return (
    <li className="rounded-xl border border-[var(--accent-soft)]/70 bg-[var(--bg-primary)] p-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-[var(--text-main)]">{label}</span>
        <span className="text-sm font-semibold text-[var(--gold)]">{price}</span>
      </div>
      {description ? (
        <p className="mt-1 text-xs text-[var(--text-main)]/80">{description}</p>
      ) : null}
    </li>
  )
}
