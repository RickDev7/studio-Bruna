'use client'

import Link from 'next/link'
import { Toaster } from 'sonner'

export function AdminLayoutChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-app min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] antialiased">
      <Toaster position="top-right" richColors />
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-card)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-6 py-4">
          <Link
            href="/admin"
            className="font-display text-lg font-semibold tracking-tight text-[var(--text-main)] transition-opacity duration-300 hover:opacity-80"
          >
            Admin
          </Link>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/admin"
              className="text-[var(--text-main)]/75 transition-colors duration-300 hover:text-[var(--text-main)]"
            >
              Controlo
            </Link>
            <Link
              href="/admin/financas"
              className="text-[var(--text-main)]/75 transition-colors duration-300 hover:text-[var(--text-main)]"
            >
              Finanças
            </Link>
            <Link
              href="/admin/pagamentos"
              className="text-[var(--text-main)]/75 transition-colors duration-300 hover:text-[var(--text-main)]"
            >
              Pagamentos
            </Link>
            <Link
              href="/admin/revenue-entry"
              className="text-[var(--text-main)]/75 transition-colors duration-300 hover:text-[var(--text-main)]"
            >
              Receitas
            </Link>
            <Link
              href="/admin/reports"
              className="text-[var(--text-main)]/75 transition-colors duration-300 hover:text-[var(--text-main)]"
            >
              Berichte
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 md:py-12">{children}</main>
    </div>
  )
}
