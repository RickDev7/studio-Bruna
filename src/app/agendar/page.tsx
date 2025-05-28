import { Navbar } from '@/components/Navbar'
import { Scheduling } from '@/components/sections/Scheduling'
import { Footer } from '@/components/sections/Footer'

export default function AgendarPage() {
  return (
    <>
      <Navbar />
      <main>
        <Scheduling />
      </main>
      <Footer />
    </>
  )
} 