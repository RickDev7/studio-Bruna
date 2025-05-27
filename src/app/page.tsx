import { Metadata } from 'next'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { AllServices } from '@/components/sections/AllServices'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'

export const metadata: Metadata = {
  title: 'Bruna Silva - Estética & Unhas',
  description: 'Tratamentos profissionais de beleza e cuidados para seu bem-estar e autoestima.',
  other: {
    'google': 'notranslate'
  }
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AllServices />
      <Services />
      <About />
      <Footer />
    </>
  )
}
