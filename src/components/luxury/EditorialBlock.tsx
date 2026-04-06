import React from 'react'
import Image from 'next/image'

interface EditorialBlockProps {
  title: string
  description: string
  image: string
  className?: string
}

export function EditorialBlock({ title, description, image, className = '' }: EditorialBlockProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-3xl border border-[var(--gold)]/35 bg-[var(--bg-secondary)] shadow-[0_7px_16px_rgba(138,92,74,0.06)] ${className}`}
    >
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover transition-transform duration-[200ms] ease-out group-hover:scale-[1.02]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--text-main)]/80 via-[var(--text-main)]/45 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
        <div className="mb-4 h-px w-16 bg-[var(--gold)]" />
        <h3 className="max-w-[18ch] text-2xl font-medium leading-[1.3] text-[var(--bg-primary)]">{title}</h3>
        <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[var(--bg-primary)]/90">{description}</p>
      </div>
    </article>
  )
}
