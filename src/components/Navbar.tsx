'use client'

import { Menu } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/#servicos' },
    { name: t('nav.plans'), href: '/#planos' },
    { name: t('nav.ourSpace'), href: '/#galeria' },
    { name: t('nav.about'), href: '/#sobre' },
    { name: t('nav.contact'), href: '/#contatos' }
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
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40
          ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Navbar */}
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
              <LanguageSelector />
              <Link 
                href="/agendar"
                className="text-sm font-medium transition-all duration-300 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white hover:shadow-lg hover:opacity-90 transform hover:scale-105"
              >
                {t('nav.schedule')}
              </Link>
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2.5 rounded-full transition-all duration-300
                  ${scrolled 
                    ? 'text-[#FF69B4] hover:bg-pink-50' 
                    : 'text-white hover:bg-white/10'}`}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Menu mobile dropdown */}
          <div 
            className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-2xl border-t border-gray-100 transform origin-top transition-all duration-300
              ${isMenuOpen 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-4 pointer-events-none'}`}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href)
                    setIsMenuOpen(false)
                  }}
                  className={`block px-4 py-3 text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50 rounded-xl text-sm font-medium transition-all duration-300
                    transform transition-transform delay-[${index * 50}ms]
                    ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-gray-100">
                <div className="flex items-center justify-center mb-3">
                  <LanguageSelector />
                </div>
                <Link 
                  href="/agendar"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block w-full text-center text-sm font-medium transition-all duration-300 px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] text-white hover:shadow-lg hover:opacity-90
                    transform transition-transform delay-[${navItems.length * 50}ms]
                    ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                >
                  {t('nav.schedule')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
} 