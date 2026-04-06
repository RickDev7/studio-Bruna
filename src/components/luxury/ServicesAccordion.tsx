'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface AccordionItem {
  title: string
  services: Array<{ name: string; price: string }>
}

interface ServicesAccordionProps {
  items: AccordionItem[]
}

export function ServicesAccordion({ items }: ServicesAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.title}
            className="overflow-hidden rounded-2xl border border-[var(--accent-soft)] bg-[var(--bg-primary)]"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-base font-semibold text-[var(--text-main)]">{item.title}</span>
              <ChevronDown
                className={`h-5 w-5 text-[var(--gold)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen ? (
              <ul className="space-y-2 border-t border-[var(--accent-soft)] px-5 py-4">
                {item.services.map((service) => (
                  <li key={`${item.title}-${service.name}`} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text-main)]/90">{service.name}</span>
                    <span className="text-sm font-semibold text-[var(--gold)]">{service.price}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
