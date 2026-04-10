'use client'

import { Card, CardContent } from '@/components/ui/card'
import { formatEUR } from '@/components/admin/dashboard/format'

type Props = {
  currentBalance: number
  pendingExpenses: number
  forecastBalance: number
  loading: boolean
}

export function FinanceSummary({
  currentBalance,
  pendingExpenses,
  forecastBalance,
  loading,
}: Props) {
  if (loading) {
    return (
      <p className="text-sm text-[var(--text-main)]/65">A carregar resumo…</p>
    )
  }

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="p-6 md:p-7">
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
          Resumo inteligente
        </h2>
        <p className="mt-2 text-sm text-[var(--text-main)]/75">
          Saldo líquido do fluxo de caixa (receitas − despesas), total pendente em
          contas a pagar e previsão após liquidar pendentes.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Saldo atual (fluxo)
            </dt>
            <dd
              className={`mt-1 text-lg font-semibold tabular-nums ${
                currentBalance >= 0 ? 'text-[#6b9b7a]' : 'text-[#c48080]'
              }`}
            >
              {formatEUR(currentBalance)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Despesas pendentes
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[#c48080]">
              {formatEUR(pendingExpenses)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--highlight)]/45 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Saldo previsto
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-[var(--gold)]">
              {formatEUR(forecastBalance)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
