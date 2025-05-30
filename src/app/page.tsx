import { Metadata } from 'next'
import { ClientProvider } from '@/components/ClientProvider'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { AllServices } from '@/components/sections/AllServices'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Bruna Silva - Aesthetic & Nails',
  description: 'Serviços de estética e beleza em Cuxhaven',
  other: {
    'google': 'notranslate'
  }
}

export default function Home() {
  return (
    <ClientProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <AllServices />
          <Services />
          <About />
        </main>
        <Footer />
      </div>
    </ClientProvider>
  )
}
