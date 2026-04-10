'use client'

import type { FinanceAlert } from '@/lib/admin/financeIntelligence'

type Props = {
  alerts: FinanceAlert[]
  loading: boolean
}

export function FinanceAlerts({ alerts, loading }: Props) {
  if (loading) return null

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/40 px-5 py-4 text-sm text-[var(--text-main)]/70">
        Sem alertas: previsão dentro dos limiares definidos.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-[var(--text-main)]">
        Alertas
      </h2>
      <ul className="space-y-2">
        {alerts.map((a) => (
          <li
            key={a.id}
            className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
              a.tone === 'danger'
                ? 'border-[#e8b4b4]/90 bg-[#fdf2f2]/95 text-[#8b4545]'
                : 'border-[#e8d4a8]/90 bg-[#fdfbf0]/95 text-[#7a6220]'
            }`}
          >
            <span className="mr-2" aria-hidden>
              ⚠️
            </span>
            {a.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
