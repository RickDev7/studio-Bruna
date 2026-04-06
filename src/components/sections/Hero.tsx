'use client'

import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner-bruna-silva-original.png"
          alt="Studio Bruna Silva - Aesthetic & Nails"
          fill
          priority
          quality={100}
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F1EC]/10" />
      </div>

      {/* Conteúdo oculto temporariamente */}
    </div>
  )
} 