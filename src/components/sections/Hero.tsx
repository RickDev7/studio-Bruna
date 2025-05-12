import { Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFC0CB] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFE4E8] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#FFB6C1] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full border border-[#FFC0CB]/30 bg-[#FFC0CB]/10 text-[#333333] text-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Seu momento de autocuidado e bem-estar</span>
          </div>
          
          <h1 className="text-4xl tracking-tight font-extrabold text-[#333333] sm:text-5xl md:text-6xl">
            <span className="block">Beleza e bem-estar</span>
            <span className="block gradient-text">em harmonia com você</span>
          </h1>
          
          <p className="mt-6 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
            Descubra um espaço dedicado à sua beleza e bem-estar. Oferecemos tratamentos personalizados com profissionais especializados, em um ambiente acolhedor e relaxante para você se sentir única e especial.
          </p>
        </div>
      </div>
    </section>
  )
} 