'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'
import { FreshaButton } from './FreshaButton'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.services'), href: '/#servicos' },
    { name: t('nav.about'), href: '/#sobre' },
    { name: t('nav.contact'), href: '/#contatos' },
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    if (href.startsWith('/#')) {
      const el = document.getElementById(href.replace('/#', ''))
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 88
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden
          ${isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ease-out
          ${scrolled
            ? 'border-b border-[#D6C1B1]/60 bg-[#F5F1EC]/90 py-1.5 shadow-[0_4px_24px_rgba(138,92,74,0.07)] backdrop-blur-md'
            : 'bg-[#F5F1EC] py-3'
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* Logo */}
            <Link
              href="/"
              onClick={(e) => handleSmoothScroll(e as React.MouseEvent<HTMLAnchorElement>, '/')}
              className="group flex flex-col"
            >
              <span className="font-display text-[1.05rem] font-semibold italic tracking-tight text-[#8A5C4A] transition-colors duration-200 group-hover:text-[#C8A27A] sm:text-lg">
                Bruna Silva
              </span>
              <span className="text-[0.6rem] font-medium uppercase tracking-[0.22em] text-[#C8A27A]">
                Aesthetic &amp; Nails · Cuxhaven
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden items-center space-x-1 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="nav-link-underline px-3 py-2 text-sm font-medium text-[#8A5C4A] transition-colors duration-200 hover:text-[#C8A27A]"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center space-x-3 lg:flex">
              <LanguageSelector />
              <FreshaButton
                size="sm"
                className="rounded-[8px] bg-[#C8A27A] hover:bg-[#8A5C4A]"
              >
                {t('nav.schedule')}
              </FreshaButton>
            </div>

            {/* Mobile: Buchen + hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <FreshaButton
                size="sm"
                className="rounded-[7px] bg-[#C8A27A] px-3 py-1.5 text-xs hover:bg-[#8A5C4A]"
              >
                Buchen
              </FreshaButton>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full p-2.5 text-[#8A5C4A] transition-colors duration-200 hover:bg-[#E7DBD1]"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <div
            className={`absolute left-0 right-0 top-full origin-top rounded-b-2xl border-t border-[#D6C1B1] bg-[#F5F1EC] shadow-lg transition-all duration-300 lg:hidden
              ${isMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'}`}
          >
            <div className="space-y-1 px-4 pb-5 pt-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.href)
                    setIsMenuOpen(false)
                  }}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-[#8A5C4A] transition-colors duration-200 hover:bg-[#E7DBD1] hover:text-[#C8A27A]"
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-3 border-t border-[#D6C1B1] pt-3">
                <div className="mb-3 flex justify-center">
                  <LanguageSelector />
                </div>
                <FreshaButton
                  size="sm"
                  className="w-full rounded-[8px] bg-[#C8A27A] hover:bg-[#8A5C4A]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.schedule')}
                </FreshaButton>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
