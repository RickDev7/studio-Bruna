import { Navbar } from '@/components/Navbar'
import { Scheduling } from '@/components/sections/Scheduling'
import { Footer } from '@/components/sections/Footer'

export default function AgendarPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="pt-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Agende seu</span>
                <span className="block gradient-text">horário</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Escolha o melhor horário para seu tratamento e cuidados com a beleza
              </p>
            </div>
          </div>
        </div>
        <Scheduling />
      </main>
      <Footer />
    </>
  )
} 