import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Heart className="h-8 w-8 text-[#FFC0CB]" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Bruna Silva - Estética & Unhas</span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link href="/#servicos" className="text-gray-600 hover:text-[#FFC0CB] transition-colors">
              Serviços
            </Link>
            <Link href="/#sobre" className="text-gray-600 hover:text-[#FFC0CB] transition-colors">
              Sobre Mim
            </Link>
            <Link href="/#contato" className="text-gray-600 hover:text-[#FFC0CB] transition-colors">
              Contato
            </Link>
            <Link
              href="/agendar"
              className="inline-flex items-center px-4 py-2 border border-[#FFC0CB] text-sm font-medium rounded-full text-white bg-[#FFC0CB] hover:bg-[#FFB6C1] transition-colors"
            >
              Agendar Horário
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 