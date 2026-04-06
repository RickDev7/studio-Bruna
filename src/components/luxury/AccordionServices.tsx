'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface ServiceRow {
  name: string
  description: string
  price: string
}

interface ServiceCategory {
  title: string
  services: ServiceRow[]
}

interface AccordionServicesProps {
  categories: ServiceCategory[]
}

export function AccordionServices({ categories }: AccordionServicesProps) {
  const [openCategory, setOpenCategory] = useState(0)

  return (
    <div className="space-y-4">
      {categories.map((category, index) => {
        const isOpen = index === openCategory
        return (
          <div
            key={category.title}
            className="overflow-hidden rounded-3xl border border-[var(--soft-accent,#D6C1B1)] bg-[var(--bg-primary)] shadow-[0_4px_14px_rgba(138,92,74,0.08)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-300 hover:bg-[var(--bg-secondary)]"
              onClick={() => setOpenCategory(isOpen ? -1 : index)}
            >
              <span className="text-lg font-medium text-[var(--text-main)]">{category.title}</span>
              <ChevronDown className={`h-5 w-5 text-[var(--gold)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen ? (
              <ul className="space-y-4 border-t border-[var(--gold)]/40 px-6 py-5">
                {category.services.map((service) => (
                  <li key={`${category.title}-${service.name}`} className="border-b border-[var(--gold)]/25 pb-4 last:border-b-0">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-base text-[var(--text-main)]">{service.name}</p>
                        <p className="mt-1 text-sm text-[var(--text-main)]/75">{service.description}</p>
                      </div>
                      <p className="whitespace-nowrap text-base font-semibold text-[var(--gold)]">{service.price}</p>
                    </div>
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
