'use client'

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Card, CardContent } from '@/components/ui/card'
import type { MonthProfitBreakdown } from '@/lib/admin/monthlyProfit'
import { formatEUR } from '@/components/admin/dashboard/format'

type Props = {
  breakdown: MonthProfitBreakdown
  loading: boolean
  referenceMonth?: Date
}

export function MonthlyProfit({
  breakdown,
  loading,
  referenceMonth = new Date(),
}: Props) {
  const label = format(referenceMonth, "MMMM yyyy", { locale: ptBR })
  const finalClass =
    breakdown.finalProfit >= 0
      ? 'text-[#6b9b7a]'
      : 'text-[#c48080]'

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-main)]/65">
        A carregar lucro mensal…
      </p>
    )
  }

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="p-6 md:p-7">
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
          Lucro mensal
        </h2>
        <p className="mt-2 text-sm text-[var(--text-main)]/75">
          Mês de referência: <span className="capitalize">{label}</span>. Inclui
          fluxo de caixa do período e lucro registado em serviços prestados.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Receitas (fluxo)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[#6b9b7a]">
              {formatEUR(breakdown.income)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Despesas (fluxo)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[#c48080]">
              {formatEUR(breakdown.expense)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Lucro serviços (registos)
            </dt>
            <dd
              className={`mt-1 text-lg font-semibold tabular-nums ${
                breakdown.serviceProfit >= 0
                  ? 'text-[#6b9b7a]'
                  : 'text-[#c48080]'
              }`}
            >
              {formatEUR(breakdown.serviceProfit)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--gold)]/35 bg-[var(--highlight)]/50 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Lucro final (fluxo líquido + serviços)
            </dt>
            <dd className={`mt-1 text-xl font-semibold tabular-nums ${finalClass}`}>
              {formatEUR(breakdown.finalProfit)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-[var(--text-main)]/60">
          Lucro do fluxo (receitas − despesas):{' '}
          <span
            className={
              breakdown.cashFlowNet >= 0
                ? 'font-medium text-[#6b9b7a]'
                : 'font-medium text-[#c48080]'
            }
          >
            {formatEUR(breakdown.cashFlowNet)}
          </span>
        </p>
      </CardContent>
    </Card>
  )
}
