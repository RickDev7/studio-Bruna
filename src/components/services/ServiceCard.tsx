import React from 'react'
import { PriceItem } from '@/components/services/PriceItem'

interface ServiceItem {
  label: string
  price: string
  description?: string
}

interface ServiceCardProps {
  title: string
  subtitle?: string
  items: ServiceItem[]
}

export function ServiceCard({ title, subtitle, items }: ServiceCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-secondary)] p-4">
      <h4 className="text-base font-semibold text-[var(--text-main)]">{title}</h4>
      {subtitle ? <p className="mt-1 text-xs text-[var(--text-main)]/80">{subtitle}</p> : null}
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <PriceItem
            key={`${title}-${item.label}`}
            label={item.label}
            price={item.price}
            description={item.description}
          />
        ))}
      </ul>
    </article>
  )
}
