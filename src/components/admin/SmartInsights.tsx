'use client'

import type { SmartInsight } from '@/lib/admin/smartInsights'

type Props = {
  insights: SmartInsight[]
  loading: boolean
}

const variantClass: Record<SmartInsight['variant'], string> = {
  positive:
    'border-[#b8d4c0]/95 bg-[#f4faf5]/95 text-[#2d5a38]',
  caution:
    'border-[#e8d4a8]/95 bg-[#fdfbf0]/95 text-[#7a6220]',
  growth:
    'border-[var(--gold)]/50 bg-[var(--highlight)]/60 text-[var(--text-main)]',
}

export function SmartInsights({ insights, loading }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-[var(--text-main)]/65">
        A carregar sugestões…
      </p>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/40 px-5 py-4 text-sm text-[var(--text-main)]/70">
        Sem sugestões automáticas para o cenário atual.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
        Sugestões inteligentes
      </h2>
      <ul className="space-y-3">
        {insights.map((i) => (
          <li
            key={i.id}
            className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed shadow-sm ${variantClass[i.variant]}`}
          >
            {i.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
