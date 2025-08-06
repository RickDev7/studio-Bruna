'use client'

import { Menu, Lock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Serviços', href: '/#servicos' },
    { name: 'Planos', href: '/#planos' },
    { name: 'Sobre', href: '/#sobre' },
    { name: 'Contatos', href: '/#contatos' }
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    
    // Se for link para home, volta ao topo suavemente
    if (href === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      return
    }

    // Se for link com âncora, scroll suave até a seção
    if (href.startsWith('/#')) {
      const targetId = href.replace('/#', '')
      const element = document.getElementById(targetId)
      if (element) {
        const offset = 100
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - offset

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-[2px] py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Links de navegação - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${scrolled 
                    ? 'text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'}
                  transform hover:scale-105`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Botões de ação - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/agendar"
              className="text-sm font-medium transition-all duration-300 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white hover:shadow-lg hover:opacity-90 transform hover:scale-105"
            >
              Agendar
            </Link>
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-full text-[#FF69B4] hover:bg-pink-50 transition-all duration-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 