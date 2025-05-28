'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Heart } from 'lucide-react'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Serviços', href: '/#todos-servicos' },
  { name: 'Planos', href: '/#planos' },
  { name: 'Sobre', href: '/#sobre' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrolled = currentScrollPos > 20
      
      // Determina se deve mostrar ou esconder o navbar baseado na direção do scroll
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10)
      setScrolled(isScrolled)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  return (
    <header 
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md' : 'bg-transparent'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center group">
              <div className="flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#FFC0CB]" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Bruna Silva - Estética & Unhas
                </span>
              </div>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#FFC0CB] transition-colors duration-200 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-[#FFC0CB] after:left-0 after:-bottom-1 after:rounded-full after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                {item.name}
              </a>
            ))}
            <a
              href="/agendar"
              className="ml-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FFC0CB] rounded-md hover:bg-[#FFB6C1] hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
            >
              Agendar Horário
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-pink-50 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog 
        as="div" 
        className="md:hidden" 
        open={mobileMenuOpen} 
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-300" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm transform transition-transform duration-300">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center group">
              <div className="flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#FFC0CB]" />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  BS Estética
                </span>
              </div>
            </a>
            <button
              type="button"
              className="rounded-md p-2.5 text-gray-700 hover:bg-pink-50 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="space-y-2 py-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-pink-50 hover:text-[#FFC0CB] transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/agendar"
                className="block w-full px-3 py-2 text-center text-base font-medium text-white bg-[#FFC0CB] rounded-md hover:bg-[#FFB6C1] hover:shadow-md transition-all duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Agendar Horário
              </a>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
} 