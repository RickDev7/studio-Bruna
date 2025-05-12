import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Problems as Services } from '@/components/sections/Problems'
import { Footer } from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Footer />
      </main>
    </>
  )
}
