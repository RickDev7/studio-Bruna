'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from '@/types/database.types'
import { createClient } from '@/config/supabase-client'
import { computeServiceLogAmounts } from '@/lib/admin/serviceLog'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import { formatEUR } from '@/components/admin/dashboard/format'
import { toast } from 'sonner'

type ServiceRow = Pick<
  Database['public']['Tables']['services']['Row'],
  'id' | 'name' | 'price' | 'estimated_cost'
>

type Props = {
  services: ServiceRow[]
  loading: boolean
  onLogged?: () => void
}

export function ServiceForm({ services, loading, onLogged }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [serviceId, setServiceId] = useState('')
  const [quantityStr, setQuantityStr] = useState('1')
  const [saving, setSaving] = useState(false)

  const quantity = Math.max(1, Math.floor(parseFloat(quantityStr) || 1))
  const selected = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  )

  const amounts = useMemo(() => {
    if (!selected) {
      return {
        total_revenue: 0,
        total_cost: 0,
        profit: 0,
        quantity: 1,
      }
    }
    return computeServiceLogAmounts(
      Number(selected.price),
      Number(selected.estimated_cost ?? 0),
      quantity
    )
  }, [selected, quantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) {
      toast.error('Escolhe um serviço.')
      return
    }
    setSaving(true)
    try {
      const { error } = await supabase.from('service_logs').insert({
        service_id: selected.id,
        quantity: amounts.quantity,
        total_revenue: amounts.total_revenue,
        total_cost: amounts.total_cost,
        profit: amounts.profit,
        total_price: amounts.total_revenue,
        advance_paid: 0,
        remaining_paid: amounts.total_revenue,
        payment_method: 'fresha',
      })
      if (error) throw error
      toast.success('Serviço registado.')
      setServiceId('')
      setQuantityStr('1')
      onLogged?.()
    } catch (err) {
      toast.error(formatSupabaseError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="p-6 md:p-7">
        <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
          Lucro por serviço
        </h2>
        <p className="mt-2 text-sm text-[var(--text-main)]/75">
          Regista um atendimento: usa o preço e o custo estimado definidos no
          serviço (podes ajustar o custo estimado na base de dados ou futura
          edição de catálogo).
        </p>

        {loading ? (
          <p className="mt-6 text-sm text-[var(--text-main)]/65">A carregar…</p>
        ) : services.length === 0 ? (
          <p className="mt-6 text-sm text-[var(--text-main)]/65">
            Não há serviços ativos. Cria serviços no sistema de marcações /
            catálogo.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="service-log-service"
                className="text-xs font-medium text-[var(--text-main)]/70"
              >
                Serviço
              </label>
              <select
                id="service-log-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-main)] outline-none transition-colors focus:border-[var(--gold)]"
              >
                <option value="">— Selecionar —</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatEUR(Number(s.price))})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="service-log-qty"
                className="text-xs font-medium text-[var(--text-main)]/70"
              >
                Quantidade
              </label>
              <input
                id="service-log-qty"
                type="number"
                min={1}
                step={1}
                value={quantityStr}
                onChange={(e) => setQuantityStr(e.target.value)}
                className="w-full max-w-[12rem] rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2.5 text-sm text-[var(--text-main)] outline-none transition-colors focus:border-[var(--gold)]"
              />
            </div>
            {selected && (
              <dl className="grid gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/50 p-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-[var(--text-main)]/65">
                    Receita
                  </dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[#6b9b7a]">
                    {formatEUR(amounts.total_revenue)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-main)]/65">Custo</dt>
                  <dd className="mt-1 font-semibold tabular-nums text-[#c48080]">
                    {formatEUR(amounts.total_cost)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--text-main)]/65">Lucro</dt>
                  <dd
                    className={`mt-1 font-semibold tabular-nums ${
                      amounts.profit >= 0
                        ? 'text-[#6b9b7a]'
                        : 'text-[#c48080]'
                    }`}
                  >
                    {formatEUR(amounts.profit)}
                  </dd>
                </div>
              </dl>
            )}
            <Button
              type="submit"
              disabled={!selected || saving}
              className="rounded-xl bg-[var(--gold)] text-[#1a1a1a] hover:opacity-95"
            >
              {saving ? 'A guardar…' : 'Registar serviço prestado'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
