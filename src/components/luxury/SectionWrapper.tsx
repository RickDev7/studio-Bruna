import React from 'react'

interface SectionWrapperProps {
  id?: string
  label?: string
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  titleAlign?: 'left' | 'center'
}

export function SectionWrapper({
  id,
  label,
  title,
  subtitle,
  children,
  className = '',
  titleAlign = 'center',
}: SectionWrapperProps) {
  const alignClass = titleAlign === 'left' ? 'text-left' : 'text-center'
  const marginClass = titleAlign === 'left' ? '' : 'mx-auto'

  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {title ? (
          <div className={`mb-10 sm:mb-12 ${alignClass}`}>
            {label ? (
              <p className={`mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-[#C8A27A] ${marginClass}`}>
                {label}
              </p>
            ) : null}
            <h2 className={`font-display max-w-[28ch] text-[1.6rem] font-normal italic leading-[1.28] tracking-tight text-[#8A5C4A] sm:text-[2rem] lg:text-[2.25rem] ${marginClass}`}>
              {title}
            </h2>
            {subtitle ? (
              <p className={`mt-4 max-w-[62ch] text-sm leading-[1.7] text-[#8A5C4A]/65 sm:text-[0.9375rem] ${marginClass}`}>
                {subtitle}
              </p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
