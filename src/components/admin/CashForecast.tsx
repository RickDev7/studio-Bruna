'use client'

import { useMemo } from 'react'
import { addDays, parseISO, startOfDay } from 'date-fns'
import type { PaymentRow } from '@/components/admin/MonthlySummary'
import { formatEUR } from '@/components/admin/dashboard/format'
import { roundMoney } from '@/lib/admin/finance'

type Props = {
  payments: PaymentRow[]
  /** Saldo disponível opcional (ex.: saldo líquido noutro ecrã) */
  currentBalance?: number | null
  referenceDate?: Date
}

export function CashForecast({
  payments,
  currentBalance,
  referenceDate = new Date(),
}: Props) {
  const { projectedPending, next30 } = useMemo(() => {
    const today = startOfDay(referenceDate)
    const horizon = addDays(today, 30)
    const pending = payments.filter((p) => p.status === 'pending')
    const projected = pending.reduce((s, p) => s + Number(p.amount), 0)
    const in30 = pending.filter((p) => {
      const d = startOfDay(parseISO(p.due_date))
      return d.getTime() <= horizon.getTime()
    })
    const sum30 = in30.reduce((s, p) => s + Number(p.amount), 0)
    return {
      projectedPending: roundMoney(projected),
      next30: roundMoney(sum30),
    }
  }, [payments, referenceDate])

  const after =
    currentBalance != null && Number.isFinite(currentBalance)
      ? roundMoney(currentBalance - projectedPending)
      : null

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/35 px-4 py-4">
        <p className="text-xs font-medium text-[var(--text-main)]/65">
          Despesas projetadas (pendentes)
        </p>
        <p className="mt-2 text-lg font-semibold tabular-nums text-[#c48080]">
          {formatEUR(projectedPending)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-main)]/55">
          Soma de todos os pagamentos ainda por liquidar.
        </p>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)]/35 px-4 py-4">
        <p className="text-xs font-medium text-[var(--text-main)]/65">
          Próximos 30 dias
        </p>
        <p className="mt-2 text-lg font-semibold tabular-nums text-[var(--text-main)]">
          {formatEUR(next30)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-main)]/55">
          Pendentes com vencimento até 30 dias (inclui atrasados).
        </p>
      </div>
      {after != null && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-4 sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-[var(--text-main)]/65">
            Saldo após obrigações pendentes
          </p>
          <p
            className={`mt-2 text-lg font-semibold tabular-nums ${
              after >= 0 ? 'text-[#6b9b7a]' : 'text-[#c48080]'
            }`}
          >
            {formatEUR(after)}
          </p>
          <p className="mt-1 text-xs text-[var(--text-main)]/55">
            Saldo indicado − total pendente.
          </p>
        </div>
      )}
    </div>
  )
}
