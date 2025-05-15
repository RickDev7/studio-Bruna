import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Plans } from '@/components/sections/Plans'
import { About } from '@/components/sections/About'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Plans />
        <About />
      </main>
      <Footer />
    </>
  )
}
