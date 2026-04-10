'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/config/supabase-client'
import { roundMoney } from '@/lib/admin/finance'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import type { Database } from '@/types/database.types'
import { toast } from 'sonner'
import { formatEUR } from '@/components/admin/dashboard/format'

type ServiceRow = Pick<
  Database['public']['Tables']['services']['Row'],
  'id' | 'name' | 'price' | 'estimated_cost'
>

type ServiceLogRow = Database['public']['Tables']['service_logs']['Row']

function parseEuro(raw: string): number {
  const n = parseFloat(raw.replace(',', '.').replace(/\s/g, '').replace(/€/g, ''))
  return Number.isFinite(n) ? n : 0
}

function formatEuroInput(n: number): string {
  if (!Number.isFinite(n)) return ''
  const s = n.toFixed(2)
  return s.replace('.', ',')
}

export function RevenueEntryPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [sessionReady, setSessionReady] = useState(false)
  const [services, setServices] = useState<ServiceRow[]>([])
  const [history, setHistory] = useState<ServiceLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [clientName, setClientName] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [serviceNameManual, setServiceNameManual] = useState('')
  const [totalStr, setTotalStr] = useState('')
  const [advanceStr, setAdvanceStr] = useState('')
  const [remainingStr, setRemainingStr] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<
    'cash' | 'card' | 'mixed'
  >('mixed')

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId]
  )

  const totalPreview = roundMoney(parseEuro(totalStr))
  const advancePreview = roundMoney(parseEuro(advanceStr))
  const remainingPreview = roundMoney(parseEuro(remainingStr))

  const loadCatalogAndHistory = useCallback(async () => {
    setLoading(true)
    try {
      const [svcRes, histRes] = await Promise.all([
        supabase
          .from('services')
          .select('id, name, price, estimated_cost')
          .or('active.eq.true,active.is.null')
          .order('name'),
        supabase
          .from('service_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(60),
      ])
      if (svcRes.error) {
        toast.error(formatSupabaseError(svcRes.error))
      }
      if (histRes.error) {
        toast.error(formatSupabaseError(histRes.error))
      }
      setServices((svcRes.data as ServiceRow[]) ?? [])
      const raw = (histRes.data as ServiceLogRow[]) ?? []
      setHistory(
        raw.filter(
          (r) =>
            r.client_name != null && String(r.client_name).trim().length > 0
        )
      )
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (cancelled) return
      if (!session) {
        router.replace('/login')
        return
      }
      setSessionReady(true)
      await loadCatalogAndHistory()
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router, loadCatalogAndHistory])

  useEffect(() => {
    if (!sessionReady) return
    const channel = supabase
      .channel('revenue-entry-logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_logs' },
        () => {
          void loadCatalogAndHistory()
        }
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [sessionReady, supabase, loadCatalogAndHistory])

  const applyTotalSplit = useCallback((total: number) => {
    const t = roundMoney(total)
    const adv = roundMoney(t * 0.3)
    const rem = roundMoney(t - adv)
    setAdvanceStr(formatEuroInput(adv))
    setRemainingStr(formatEuroInput(rem))
  }, [])

  const handleTotalChange = (v: string) => {
    setTotalStr(v)
    const t = roundMoney(parseEuro(v))
    if (t > 0) applyTotalSplit(t)
    else {
      setAdvanceStr('')
      setRemainingStr('')
    }
  }

  const handleAdvanceChange = (v: string) => {
    setAdvanceStr(v)
    const total = roundMoney(parseEuro(totalStr))
    const adv = roundMoney(parseEuro(v))
    if (total > 0) {
      setRemainingStr(formatEuroInput(roundMoney(total - adv)))
    }
  }

  const handleRemainingChange = (v: string) => {
    setRemainingStr(v)
    const total = roundMoney(parseEuro(totalStr))
    const rem = roundMoney(parseEuro(v))
    if (total > 0) {
      setAdvanceStr(formatEuroInput(roundMoney(total - rem)))
    }
  }

  const handleServicePick = (id: string) => {
    setServiceId(id)
    const s = services.find((x) => x.id === id)
    if (s) {
      const p = roundMoney(Number(s.price))
      setTotalStr(formatEuroInput(p))
      applyTotalSplit(p)
    }
  }

  const resetForm = () => {
    setClientName('')
    setServiceId('')
    setServiceNameManual('')
    setTotalStr('')
    setAdvanceStr('')
    setRemainingStr('')
    setPaymentMethod('mixed')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = clientName.trim()
    if (!name) {
      toast.error('Indica o nome do cliente.')
      return
    }
    const total = roundMoney(parseEuro(totalStr))
    if (total <= 0) {
      toast.error('O total do serviço tem de ser maior que zero.')
      return
    }
    let advance = roundMoney(parseEuro(advanceStr))
    let remaining = roundMoney(parseEuro(remainingStr))
    remaining = roundMoney(total - advance)
    setRemainingStr(formatEuroInput(remaining))

    if (advance < 0 || remaining < 0) {
      toast.error('Valores de pagamento inválidos.')
      return
    }
    if (advance > total) {
      toast.error('O sinal não pode ser superior ao total.')
      return
    }

    const est = selectedService
      ? roundMoney(Number(selectedService.estimated_cost ?? 0))
      : 0
    const profit = roundMoney(total - est)
    const displayServiceName =
      selectedService?.name?.trim() ||
      serviceNameManual.trim() ||
      null

    const logPayload: Database['public']['Tables']['service_logs']['Insert'] = {
      service_id: serviceId || null,
      quantity: 1,
      total_revenue: total,
      total_cost: est,
      profit,
      client_name: name,
      service_name: displayServiceName,
      total_price: total,
      advance_paid: advance,
      remaining_paid: remaining,
      payment_method: paymentMethod,
    }

    setSaving(true)
    try {
      const { data: inserted, error: logErr } = await supabase
        .from('service_logs')
        .insert(logPayload)
        .select('id')
        .single()

      if (logErr) throw logErr
      const newId = inserted?.id
      if (!newId) throw new Error('Registo sem id.')

      const flows: Database['public']['Tables']['cash_flow']['Insert'][] = []
      if (advance > 0) {
        flows.push({
          type: 'income',
          category: 'service_advance',
          amount: advance,
          description: `Pagamento sinal (online) — ${name}`,
        })
      }
      if (remaining > 0) {
        flows.push({
          type: 'income',
          category: 'service_payment',
          amount: remaining,
          description: `Pagamento final (loja) — ${name}`,
        })
      }

      if (flows.length > 0) {
        const { error: cfErr } = await supabase.from('cash_flow').insert(flows)
        if (cfErr) {
          await supabase.from('service_logs').delete().eq('id', newId)
          throw cfErr
        }
      }

      toast.success('Receita registada e fluxo de caixa atualizado.')
      resetForm()
      await loadCatalogAndHistory()
    } catch (err) {
      toast.error(formatSupabaseError(err))
    } finally {
      setSaving(false)
    }
  }

  if (!sessionReady && loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-main)]/60">
        A carregar…
      </div>
    )
  }

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-main)] md:text-4xl">
            Entrada de receitas
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-main)]/70">
            Regista serviços concluídos: o registo vai para{' '}
            <span className="font-medium">service_logs</span> e o pagamento
            divide-se em duas receitas no{' '}
            <span className="font-medium">fluxo de caixa</span> (sinal + final).{' '}
            <Link
              href="/admin/financas"
              className="font-medium text-[var(--gold)] underline decoration-[var(--border)] underline-offset-2 hover:decoration-[var(--gold)]"
            >
              Ver Finanças
            </Link>
          </p>
        </div>
      </div>

      <Card className="admin-card overflow-hidden !shadow-none">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="rev-client"
                className="text-sm font-medium text-[var(--text-main)]"
              >
                Nome do cliente
              </label>
              <input
                id="rev-client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                autoComplete="name"
                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                placeholder="Ex.: Maria Silva"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-1">
              <div className="space-y-2">
                <label
                  htmlFor="rev-service-cat"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Serviço (catálogo, opcional)
                </label>
                <select
                  id="rev-service-cat"
                  value={serviceId}
                  onChange={(e) => handleServicePick(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                >
                  <option value="">— Sem catálogo —</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({formatEUR(Number(s.price))})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="rev-service-manual"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Nome do serviço (texto livre)
                </label>
                <input
                  id="rev-service-manual"
                  value={serviceNameManual}
                  onChange={(e) => setServiceNameManual(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                  placeholder="Ex.: Manicure gel"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rev-total"
                className="text-sm font-medium text-[var(--text-main)]"
              >
                Preço total do serviço (€)
              </label>
              <input
                id="rev-total"
                inputMode="decimal"
                value={totalStr}
                onChange={(e) => handleTotalChange(e.target.value)}
                className="min-h-12 w-full rounded-xl border-2 border-[var(--gold)]/40 bg-[var(--highlight)]/30 px-4 py-3 text-lg font-semibold tabular-nums text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                placeholder="0,00"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="rev-adv"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Sinal pago (30% sugerido)
                </label>
                <input
                  id="rev-adv"
                  inputMode="decimal"
                  value={advanceStr}
                  onChange={(e) => handleAdvanceChange(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base tabular-nums text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="rev-rem"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Saldo pago na loja
                </label>
                <input
                  id="rev-rem"
                  inputMode="decimal"
                  value={remainingStr}
                  onChange={(e) => handleRemainingChange(e.target.value)}
                  className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base tabular-nums text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/50 px-4 py-3 text-sm">
              <p className="text-[var(--text-main)]/70">Pré-visualização</p>
              <p className="mt-1 text-[var(--gold)]">
                Total:{' '}
                <span className="text-lg font-semibold tabular-nums">
                  {formatEUR(totalPreview)}
                </span>
              </p>
              <p className="text-[#6b9b7a]">
                Sinal: {formatEUR(advancePreview)} · Saldo:{' '}
                {formatEUR(remainingPreview)}
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--text-main)]">
                Meio de pagamento
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {(
                  [
                    ['cash', 'Numerário'],
                    ['card', 'Cartão'],
                    ['mixed', 'Misto'],
                  ] as const
                ).map(([val, label]) => (
                  <label
                    key={val}
                    className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-base ${
                      paymentMethod === val
                        ? 'border-[var(--gold)] bg-[var(--highlight)]/50'
                        : 'border-[var(--border)] bg-[var(--bg-card)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pay"
                      value={val}
                      checked={paymentMethod === val}
                      onChange={() => setPaymentMethod(val)}
                      className="h-4 w-4 accent-[var(--gold)]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>

            <Button
              type="submit"
              disabled={saving}
              className="min-h-12 w-full rounded-xl bg-[var(--gold)] text-base font-medium text-[#1a1a1a] hover:opacity-95 sm:w-auto sm:px-10"
            >
              {saving ? 'A guardar…' : 'Registar receita'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display text-xl font-semibold text-[var(--text-main)]">
          Últimos registos
        </h2>
        {loading ? (
          <p className="mt-4 text-sm text-[var(--text-main)]/60">A carregar…</p>
        ) : history.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-main)]/60">
            Ainda não há entradas com cliente associado.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[320px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)]/60 text-xs uppercase tracking-wide text-[var(--text-main)]/65">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Sinal</th>
                  <th className="px-4 py-3 font-medium">Saldo</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[var(--border)]/80 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-main)]">
                      {row.client_name}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[var(--gold)]">
                      {formatEUR(Number(row.total_price))}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[#6b9b7a]">
                      {formatEUR(Number(row.advance_paid))}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-[var(--text-main)]">
                      {formatEUR(Number(row.remaining_paid))}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-main)]/70">
                      {new Intl.DateTimeFormat('pt-PT', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(row.created_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
