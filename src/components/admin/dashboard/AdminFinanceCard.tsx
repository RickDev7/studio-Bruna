'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  BASE_SECURITY_EUR,
  STOCK_RESERVE_EUR,
  type DistributionResult,
} from '@/lib/admin/finance'
import { formatEUR } from './format'

type Props = {
  totalBalanceInput: string
  onTotalBalanceChange: (v: string) => void
  netBalance: number
  distribution: DistributionResult
  onSaveLog: () => void
  saving: boolean
}

export function AdminFinanceCard({
  totalBalanceInput,
  onTotalBalanceChange,
  netBalance,
  distribution,
  onSaveLog,
  saving,
}: Props) {
  const total = parseFloat(totalBalanceInput.replace(',', '.')) || 0

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="p-6 space-y-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Finanças
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/75">
            Saldo total e deduções fixas antes da distribuição.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-main)]">
            Saldo total
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={totalBalanceInput}
            onChange={(e) => onTotalBalanceChange(e.target.value)}
            placeholder="0,00"
            className="admin-field w-full max-w-xs px-3 py-2.5 text-sm"
          />
        </div>

        <dl className="grid gap-3 text-sm">
          <div className="flex justify-between border-b border-[var(--border)] pb-3">
            <dt className="text-[var(--text-main)]/80">Saldo total</dt>
            <dd className="font-semibold tabular-nums text-[var(--gold)]">
              {formatEUR(total)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-[var(--border)] pb-3">
            <dt className="text-[var(--text-main)]/80">
              Base segurança (−{BASE_SECURITY_EUR}€)
            </dt>
            <dd className="font-medium tabular-nums text-[var(--text-main)]/85">
              −{formatEUR(BASE_SECURITY_EUR)}
            </dd>
          </div>
          <div className="flex justify-between border-b border-[var(--border)] pb-3">
            <dt className="text-[var(--text-main)]/80">
              Reserva stock (−{STOCK_RESERVE_EUR}€)
            </dt>
            <dd className="font-medium tabular-nums text-[var(--text-main)]/85">
              −{formatEUR(STOCK_RESERVE_EUR)}
            </dd>
          </div>
          <div className="flex justify-between pt-1">
            <dt className="font-medium text-[var(--text-main)]">Saldo líquido</dt>
            <dd
              className={`font-bold tabular-nums text-lg ${
                netBalance < 0
                  ? 'text-[#a85c5c]'
                  : 'text-[var(--gold)]'
              }`}
            >
              {formatEUR(netBalance)}
            </dd>
          </div>
        </dl>

        {distribution.mode === 'negative_net' && (
          <p className="rounded-2xl border border-[var(--border)] bg-[var(--highlight)] px-4 py-3 text-sm leading-relaxed text-[var(--text-main)] transition-colors duration-300">
            Saldo líquido negativo: não há valores a distribuir neste cenário.
          </p>
        )}

        <Button
          type="button"
          onClick={onSaveLog}
          disabled={saving || distribution.mode === 'negative_net'}
          className="rounded-xl border-0 bg-[var(--gold)] text-white shadow-none transition-all duration-300 hover:brightness-[0.92] disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Guardar registo financeiro'}
        </Button>
      </CardContent>
    </Card>
  )
}
