'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      if (pathname === '/') {
        const sections = ['servicos', 'planos', 'sobre']
        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.top <= 100 && rect.bottom >= 100) {
              setActiveSection(section)
              break
            }
          }
        }
        if (window.scrollY < 100) {
          setActiveSection('')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsAuthenticated(true)
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single()
        
        setIsAdmin(profile?.is_admin || false)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setIsAdmin(false)
      router.push('/')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      router.push('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMenuOpen(false)
  }

  const menuItems = [
    { href: '/', label: 'Início', action: () => router.push('/') },
    { href: '#servicos', label: 'Serviços', action: () => scrollToSection('servicos') },
    { href: '#planos', label: 'Planos', action: () => scrollToSection('planos') },
    { href: '#sobre', label: 'Sobre', action: () => scrollToSection('sobre') },
    { href: '/agendar', label: 'Agendar', action: () => router.push('/agendar') },
  ]

  if (isAdmin) {
    menuItems.push({ 
      href: '/admin', 
      label: 'Painel Admin', 
      action: () => router.push('/admin')
    })
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/' && activeSection === ''
    if (path.startsWith('#')) {
      return activeSection === path.replace('#', '')
    }
    return pathname === path
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF69B4] to-[#FFB6C1] bg-clip-text text-transparent">
              Bruna Silva - Aesthetic & Nails
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.href}
                onClick={item.action}
                className={`text-base font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-[#FF69B4] scale-105'
                    : 'text-gray-600 hover:text-[#FF69B4] hover:scale-105'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-[#FF69B4] text-base font-medium transition-all duration-300"
              >
                Sair
              </button>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-[#FF69B4] text-base font-medium transition-all duration-300"
              >
                Entrar
              </Link>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/90 backdrop-blur-md rounded-b-2xl border-t border-pink-100">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={item.action}
                  className={`block w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-300 text-left ${
                    isActive(item.href)
                      ? 'text-[#FF69B4] bg-pink-50'
                      : 'text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50 transition-all duration-300 text-left"
                >
                  Sair
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-[#FF69B4] hover:bg-pink-50 transition-all duration-300 text-left"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 