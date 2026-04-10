'use client'

import { useMemo } from 'react'
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import type { FinanceChartDatum } from '@/lib/admin/financeIntelligence'
import { formatEUR } from '@/components/admin/dashboard/format'

type Props = {
  data: FinanceChartDatum[]
  loading: boolean
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: FinanceChartDatum }>
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-[var(--text-main)]">
        {format(new Date(row.t), 'd MMM yyyy', { locale: ptBR })}
      </p>
      {row.saldoReal != null && (
        <p className="text-[#6b9b7a]">Saldo real: {formatEUR(row.saldoReal)}</p>
      )}
      {row.projecao != null && (
        <p className="text-[var(--gold)]">Projeção: {formatEUR(row.projecao)}</p>
      )}
    </div>
  )
}

export function FinanceChart({ data, loading }: Props) {
  const hasReal = useMemo(
    () => data.some((d) => d.saldoReal != null),
    [data]
  )
  const hasProj = useMemo(
    () => data.some((d) => d.projecao != null),
    [data]
  )

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-4 p-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Evolução e projeção
          </h2>
          <p className="mt-2 text-sm text-[var(--text-main)]/75">
            Linha verde: saldo cumulativo real (fluxo de caixa). Linha tracejada
            dourada: projeção para os próximos 30 dias com base em pagamentos
            pendentes.
          </p>
        </div>
        {loading ? (
          <p className="text-sm text-[var(--text-main)]/65">A carregar gráfico…</p>
        ) : !hasReal && !hasProj ? (
          <p className="text-sm text-[var(--text-main)]/65">
            Ainda não há dados suficientes para o gráfico.
          </p>
        ) : (
          <div className="w-full" style={{ minHeight: 320 }}>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={data}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.6}
                />
                <XAxis
                  dataKey="t"
                  type="number"
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(v) =>
                    format(new Date(v), 'dd/MM', { locale: ptBR })
                  }
                  stroke="var(--text-main)"
                  tick={{
                    fill: 'var(--text-main)',
                    fontSize: 11,
                    opacity: 0.65,
                  }}
                />
                <YAxis
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('pt-PT', {
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(v) + ' €'
                  }
                  stroke="var(--text-main)"
                  tick={{
                    fill: 'var(--text-main)',
                    fontSize: 11,
                    opacity: 0.65,
                  }}
                  width={56}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: 'var(--text-main)' }}
                />
                {hasReal && (
                  <Line
                    type="monotone"
                    dataKey="saldoReal"
                    name="Saldo cumulativo (real)"
                    stroke="#6b9b7a"
                    strokeWidth={2}
                    dot={false}
                    connectNulls
                  />
                )}
                {hasProj && (
                  <Line
                    type="monotone"
                    dataKey="projecao"
                    name="Projeção (30 dias)"
                    stroke="#b8860b"
                    strokeWidth={2}
                    strokeDasharray="6 4"
                    dot={false}
                    connectNulls
                    opacity={0.9}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
