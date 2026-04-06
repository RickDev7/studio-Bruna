'use client'

import React from 'react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { ServicesAndPricesSection } from '@/components/sections/ServicesAndPrices'

export default function ServicosPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F1EC]">
      <Navbar />
      <main className="flex-1 pt-20">
        <ServicesAndPricesSection />
      </main>
      <Footer />
    </div>
  )
}
