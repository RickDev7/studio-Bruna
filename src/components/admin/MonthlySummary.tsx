'use client'

import { useMemo } from 'react'
import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
} from 'date-fns'
import type { Database } from '@/types/database.types'
import { formatEUR } from '@/components/admin/dashboard/format'

export type PaymentRow = Database['public']['Tables']['payments']['Row']

type Props = {
  payments: PaymentRow[]
  referenceDate?: Date
}

export function MonthlySummary({
  payments,
  referenceDate = new Date(),
}: Props) {
  const { totalMonth, paidSum, remaining } = useMemo(() => {
    const start = startOfMonth(referenceDate)
    const end = endOfMonth(referenceDate)
    const inMonth = payments.filter((p) => {
      const d = parseISO(p.due_date)
      return isWithinInterval(d, { start, end })
    })
    const total = inMonth.reduce((s, p) => s + Number(p.amount), 0)
    const paid = inMonth
      .filter((p) => p.status === 'paid')
      .reduce((s, p) => s + Number(p.amount), 0)
    const pending = inMonth
      .filter((p) => p.status === 'pending')
      .reduce((s, p) => s + Number(p.amount), 0)
    return {
      totalMonth: total,
      paidSum: paid,
      remaining: pending,
    }
  }, [payments, referenceDate])

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/70 px-4 py-4">
        <p className="text-xs font-medium text-[var(--text-main)]/65">
          Total no mês (vencimentos)
        </p>
        <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--text-main)]">
          {formatEUR(totalMonth)}
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/70 px-4 py-4">
        <p className="text-xs font-medium text-[var(--text-main)]/65">Já pago</p>
        <p className="mt-2 text-lg font-semibold tabular-nums text-[#6b9b7a]">
          {formatEUR(paidSum)}
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--highlight)]/40 px-4 py-4">
        <p className="text-xs font-medium text-[var(--text-main)]/65">
          Por pagar (pendente)
        </p>
        <p className="mt-2 text-xl font-semibold tabular-nums text-[var(--gold)]">
          {formatEUR(remaining)}
        </p>
      </div>
    </div>
  )
}
