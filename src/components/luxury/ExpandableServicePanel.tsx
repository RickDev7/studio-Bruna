'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ServiceItem {
  name: string
  description: string
  price: string
  highlighted?: boolean
  variant?: string
}

interface ServiceCategory {
  title: string
  items: ServiceItem[]
}

interface ExpandableServicePanelProps {
  categories: ServiceCategory[]
}

export function ExpandableServicePanel({ categories }: ExpandableServicePanelProps) {
  const [open, setOpen] = useState(0)

  return (
    <div className="space-y-3 sm:space-y-4">
      {categories.map((category, index) => {
        const isOpen = open === index
        return (
          <motion.div
            key={category.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`overflow-hidden rounded-[22px] border bg-[#F5F1EC] transition-shadow duration-200 ease-out ${
              isOpen
                ? 'border-[#C8A27A] shadow-[0_8px_24px_rgba(138,92,74,0.10)]'
                : 'border-[#D6C1B1] shadow-[0_2px_8px_rgba(138,92,74,0.05)]'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : index)}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors duration-200 ease-out sm:px-6 sm:py-5 ${
                isOpen ? 'bg-[#E7DBD1]' : 'hover:bg-[#F5F1EC]/70 active:bg-[#E7DBD1]'
              }`}
            >
              <span className="text-base font-semibold text-[#8A5C4A] sm:text-lg">
                {category.title}
              </span>
              <ChevronDown
                className={`ml-3 h-4 w-4 shrink-0 text-[#C8A27A] transition-transform duration-200 ease-out ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden border-t border-[#C8A27A]/45 px-5 pb-5 pt-1 sm:px-6"
                >
                  {category.items.map((item) => (
                    <li
                      key={`${category.title}-${item.name}`}
                      className={`border-b border-[#D6C1B1]/60 py-3 last:border-b-0 sm:py-4 ${item.highlighted ? 'rounded-lg bg-[#E7DBD1]/50 px-2 -mx-2' : ''}`}
                    >
                      <div className="grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-0.5">
                        <div>
                          <p className={`text-[0.8125rem] leading-[1.45] sm:text-[0.9375rem] ${item.highlighted ? 'font-semibold text-[#8A5C4A]' : 'font-medium text-[#8A5C4A]'}`}>
                            {item.name}
                          </p>
                          {item.description ? (
                            <p className="mt-0.5 text-xs leading-[1.5] text-[#8A5C4A]/60 sm:text-[0.8125rem]">
                              {item.description}
                            </p>
                          ) : null}
                          {item.variant ? (
                            <p className="mt-1 text-xs leading-[1.5] text-[#C8A27A]/80 italic sm:text-[0.8125rem]">
                              {item.variant}
                            </p>
                          ) : null}
                        </div>
                        <p className={`whitespace-nowrap text-right font-bold sm:text-[0.9375rem] ${item.highlighted ? 'w-[5rem] text-[0.9375rem] text-[#8A5C4A]' : 'w-[4.5rem] text-sm text-[#C8A27A]'}`}>
                          {item.price}
                        </p>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
