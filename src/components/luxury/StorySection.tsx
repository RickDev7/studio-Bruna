'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface StorySectionProps {
  title?: string
  subtitle?: string
  text?: string
  className?: string
}

export function StorySection({ title, subtitle, text, className = '' }: StorySectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`py-12 sm:py-16 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Top decorative line */}
          <div className="mx-auto mb-6 h-px w-16 bg-[#C8A27A]/40" />

          {title ? (
            <h2 className="font-display mx-auto max-w-[26ch] text-[1.5rem] font-normal italic leading-[1.32] text-[#8A5C4A] sm:text-[2rem] lg:text-[2.25rem]">
              {title}
            </h2>
          ) : null}
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-[58ch] text-[0.9rem] leading-[1.7] text-[#8A5C4A]/70 sm:text-[0.9375rem]">
              {subtitle}
            </p>
          ) : null}
          {text ? (
            <p className="mx-auto mt-4 max-w-[60ch] text-sm leading-[1.7] text-[#8A5C4A]/65 sm:text-[0.9375rem]">
              {text}
            </p>
          ) : null}

          {/* Bottom decorative line */}
          <div className="mx-auto mt-6 h-px w-16 bg-[#C8A27A]/40" />
        </div>
      </div>
    </motion.section>
  )
}
