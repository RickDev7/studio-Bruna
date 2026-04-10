'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  ONE_MONTH_FIXED_EXPENSES_EUR,
  type DistributionResult,
} from '@/lib/admin/finance'
import { formatEUR } from './format'

function DistributionBar({
  label,
  value,
  percentOfWhole,
  barClass,
}: {
  label: string
  value: number
  percentOfWhole: number
  barClass: string
}) {
  const width = Math.min(100, Math.max(0, percentOfWhole))
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--text-main)]/85">{label}</span>
        <span className="font-medium tabular-nums text-[var(--gold)]">
          {formatEUR(value)} · {percentOfWhole.toFixed(0)}%
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[var(--bg-soft)]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barClass}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

type Props = {
  distribution: DistributionResult
  netBalance: number
  accumulatedEmergency: number
}

export function AdminDistributionCard({
  distribution,
  netBalance,
  accumulatedEmergency,
}: Props) {
  const isNegative = distribution.mode === 'negative_net'
  const standard = distribution.mode === 'standard'
  const redistributed = distribution.mode === 'redistributed'

  const salaryPct = standard ? 50 : redistributed ? 60 : 0
  const investmentPct = standard ? 25 : redistributed ? 40 : 0
  const emergencyPct = standard ? 25 : 0

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="p-6 space-y-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Distribuição
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/75">
            Partilha do saldo líquido. Fundo emergência acumulado (histórico):{' '}
            <span className="font-semibold text-[var(--gold)]">
              {formatEUR(accumulatedEmergency)}
            </span>
            . Meta 1 mês despesas fixas:{' '}
            <span className="font-medium text-[var(--text-main)]">
              {formatEUR(ONE_MONTH_FIXED_EXPENSES_EUR)}
            </span>
            .
          </p>
        </div>

        {redistributed && (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--highlight)] px-4 py-3 text-sm leading-relaxed text-[var(--text-main)] transition-colors duration-300">
            Fundo de emergência já cobre pelo menos 1 mês de despesas fixas: aplica-se
            salário 60% · investimento 40% · emergência 0%.
          </p>
        )}

        {isNegative ? (
          <p className="text-sm text-[var(--text-main)]/65">
            Sem distribuição (saldo líquido ≤ 0).
          </p>
        ) : (
          <div className="space-y-5">
            <DistributionBar
              label="Salário"
              value={distribution.salary}
              percentOfWhole={salaryPct}
              barClass="bg-[var(--text-main)]"
            />
            <DistributionBar
              label="Investimento"
              value={distribution.investment}
              percentOfWhole={investmentPct}
              barClass="bg-[var(--gold)]"
            />
            <DistributionBar
              label="Emergência"
              value={distribution.emergency}
              percentOfWhole={emergencyPct}
              barClass="bg-[var(--hover)]"
            />
            <p className="pt-1 text-xs text-[var(--text-main)]/55">
              Barras mostram percentagem do saldo líquido ({formatEUR(netBalance)}).
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
