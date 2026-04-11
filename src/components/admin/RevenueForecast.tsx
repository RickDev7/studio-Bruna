'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { Card, CardContent } from '@/components/ui/card'
import { formatEUR } from '@/components/admin/dashboard/format'
import type { CashFlowMonthSlice } from '@/lib/admin/monthlyProfit'
import {
  computeMonthlyRevenueForecast,
  type ServiceLogRevenueRow,
} from '@/lib/admin/revenueForecast'

type Props = {
  serviceLogs: ServiceLogRevenueRow[]
  cashFlowRows?: CashFlowMonthSlice[]
  loading: boolean
  referenceDate?: Date
}

export function RevenueForecast({
  serviceLogs,
  cashFlowRows = [],
  loading,
  referenceDate = new Date(),
}: Props) {
  const f = useMemo(
    () =>
      computeMonthlyRevenueForecast(
        serviceLogs,
        referenceDate,
        cashFlowRows
      ),
    [serviceLogs, referenceDate, cashFlowRows]
  )

  const monthLabel = format(referenceDate, 'MMMM yyyy', { locale: ptBR })
  const progressPct =
    f.finalForecast > 0
      ? Math.min(100, (f.currentRevenue / f.finalForecast) * 100)
      : 0

  const maxBar = useMemo(
    () => Math.max(1, ...f.chartBars.map((b) => b.value)),
    [f.chartBars]
  )

  if (loading) {
    return (
      <p className="text-sm text-[var(--text-main)]/65">
        A carregar previsão de faturação…
      </p>
    )
  }

  const growthClass =
    f.growthVsLastMonthPct != null && f.growthVsLastMonthPct >= 0
      ? 'text-[#6b9b7a]'
      : 'text-[#c48080]'

  const insightText =
    f.insight === 'growing'
      ? 'Está a crescer este mês face ao ritmo e à história recente.'
      : f.insight === 'below'
        ? 'Atenção: faturamento previsto abaixo do mês anterior.'
        : 'Ritmo alinhado com o mês passado.'

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-6 p-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Previsão de faturação (serviços)
          </h2>
          <p className="mt-2 text-sm text-[var(--text-main)]/75">
            Soma <span className="font-medium">receita em service_logs</span> e
            receitas de <span className="font-medium">serviço</span> no fluxo de
            caixa (linhas ligadas ao mesmo serviço não duplicam). Mês:{' '}
            <span className="capitalize font-medium">{monthLabel}</span> (dia{' '}
            {f.currentDay}/{f.daysInMonth}).
          </p>
        </div>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Faturamento atual
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[#6b9b7a]">
              {formatEUR(f.currentRevenue)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--gold)]/40 bg-[var(--highlight)]/55 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Previsão (fim do mês)
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-[var(--gold)]">
              {formatEUR(f.finalForecast)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Mês anterior (real)
            </dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums text-[var(--text-main)]">
              {formatEUR(f.lastMonthRevenue)}
            </dd>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
            <dt className="text-xs font-medium text-[var(--text-main)]/65">
              Crescimento vs mês anterior
            </dt>
            <dd className={`mt-1 text-lg font-semibold tabular-nums ${growthClass}`}>
              {f.growthVsLastMonthPct == null
                ? '—'
                : `${f.growthVsLastMonthPct >= 0 ? '+' : ''}${f.growthVsLastMonthPct.toFixed(1)}%`}
            </dd>
          </div>
        </dl>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[var(--text-main)]/65">
            <span>Progresso face à previsão</span>
            <span className="tabular-nums">{progressPct.toFixed(0)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[var(--border)]/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#6b9b7a] to-[var(--gold)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--text-main)]/65">
            Últimos meses (total receita serviços)
          </p>
          <div className="flex h-[5.5rem] items-end gap-2 border-t border-[var(--border)]/30 pt-2">
            {f.chartBars.map((b) => {
              const hPx =
                maxBar > 0
                  ? Math.max(b.value > 0 ? 6 : 2, (b.value / maxBar) * 72)
                  : 0
              return (
                <div
                  key={b.label}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <div
                    className="w-full max-w-[2.75rem] rounded-t-md bg-[var(--gold)]/55 transition-all"
                    style={{ height: hPx }}
                    title={`${b.label}: ${formatEUR(b.value)}`}
                  />
                  <span className="max-w-full truncate text-center text-[10px] text-[var(--text-main)]/55">
                    {b.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
            f.insight === 'growing'
              ? 'border-[#b8d4c0]/90 bg-[#f4faf5]/90 text-[#2d5a38]'
              : f.insight === 'below'
                ? 'border-[#e8b4b4]/90 bg-[#fdf2f2]/90 text-[#8b4545]'
                : 'border-[var(--border)] bg-[var(--bg-soft)]/50 text-[var(--text-main)]/80'
          }`}
        >
          <strong className="font-semibold">Insight:</strong> {insightText}
        </div>

        <p className="text-[11px] text-[var(--text-main)]/50">
          Base: extrapolação diária · ajuste de ritmo vs mês anterior · média
          dos 3 meses anteriores misturada 50/50 com a previsão ajustada.
        </p>
      </CardContent>
    </Card>
  )
}
