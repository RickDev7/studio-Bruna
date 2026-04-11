'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  PiggyBank,
  Wallet,
} from 'lucide-react'
import { Toaster } from 'sonner'

const NAV = [
  {
    href: '/admin',
    label: 'Controlo',
    icon: LayoutDashboard,
    isActive: (p: string) => p === '/admin' || p === '/admin/',
  },
  {
    href: '/admin/financas',
    label: 'Finanças',
    icon: Wallet,
    isActive: (p: string) => p.startsWith('/admin/financas'),
  },
  {
    href: '/admin/pagamentos',
    label: 'Pagamentos',
    icon: CreditCard,
    isActive: (p: string) => p.startsWith('/admin/pagamentos'),
  },
  {
    href: '/admin/revenue-entry',
    label: 'Receitas',
    icon: PiggyBank,
    isActive: (p: string) => p.startsWith('/admin/revenue-entry'),
  },
  {
    href: '/admin/reports',
    label: 'Relatórios',
    icon: FileText,
    isActive: (p: string) => p.startsWith('/admin/reports'),
  },
] as const

export function AdminLayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ''

  return (
    <div className="admin-app min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg-card)]/90 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--bg-card)]/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-3.5">
          <div className="flex shrink-0 items-center gap-3 border-b border-[var(--border)]/60 pb-3 sm:border-b-0 sm:pb-0">
            <Link
              href="/admin"
              aria-label="Bruna Silva — ir para o painel administrativo"
              className="group shrink-0 rounded-lg outline-none ring-offset-2 ring-offset-[var(--bg-card)] transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            >
              <span className="inline-flex flex-col items-start gap-1 sm:gap-1.5">
                <span className="font-display text-lg font-normal italic leading-[1.1] tracking-tight text-[var(--text-main)] sm:text-xl">
                  Bruna Silva
                </span>
                <span className="font-sans text-[0.625rem] font-medium uppercase leading-tight tracking-[0.22em] text-[var(--gold)] sm:text-[0.6875rem]">
                  Aesthetic & Nails · Cuxhaven
                </span>
              </span>
            </Link>
          </div>

          <nav
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-end sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Secções do painel"
          >
            <div className="flex w-max gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/40 p-1 sm:w-auto sm:flex-wrap sm:justify-end">
              {NAV.map(({ href, label, icon: Icon, isActive }) => {
                const active = isActive(pathname)
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 sm:px-4',
                      active
                        ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm ring-1 ring-[var(--border)]'
                        : 'text-[var(--text-main)]/65 hover:bg-[var(--bg-card)]/70 hover:text-[var(--text-main)]',
                    ].join(' ')}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${active ? 'text-[var(--gold)]' : 'text-[var(--text-main)]/50'}`}
                      strokeWidth={active ? 2.25 : 2}
                      aria-hidden
                    />
                    <span>{label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:py-12">{children}</main>
    </div>
  )
}
