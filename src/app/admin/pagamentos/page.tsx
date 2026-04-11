'use client'

import { AccountsPayablePanel } from '@/components/admin/AccountsPayablePanel'

export default function PagamentosAdmin() {
  return (
    <div className="space-y-10">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-main)] md:text-4xl">
        Pagamentos
      </h1>
      <AccountsPayablePanel />
    </div>
  )
}
