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
import {
  paymentMethodLabel,
  REVENUE_PAYMENT_OPTIONS,
  type RevenuePaymentMethod,
} from '@/lib/admin/revenuePaymentLabels'
import { Trash2 } from 'lucide-react'

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

function todayYmd(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** `YYYY-MM-DD` (input date) → ISO para `cash_flow.created_at` (meio-dia hora local). */
function dateStrToCashFlowTimestamp(dateStr: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim())
  if (!m) throw new Error('Formato de data inválido.')
  const y = Number(m[1])
  const mo = Number(m[2])
  const da = Number(m[3])
  const local = new Date(y, mo - 1, da, 12, 0, 0, 0)
  return local.toISOString()
}

function formatPtDateOnly(isoDate: string | null | undefined): string {
  if (!isoDate) return '—'
  const parts = isoDate.slice(0, 10).split('-').map(Number)
  const [y, mo, da] = parts
  if (!y || !mo || !da) return '—'
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'short' }).format(
    new Date(y, mo - 1, da)
  )
}

type ServiceLogInsert = Database['public']['Tables']['service_logs']['Insert']

/** Remove colunas de data (se a BD remota ainda não as tiver). */
function stripPaymentDateFields(p: ServiceLogInsert): ServiceLogInsert {
  const { advance_paid_on: _a, remaining_paid_on: _r, ...rest } = p
  return rest
}

/**
 * Inserts com vários “degraus” para BD antiga (sem colunas de data ou com enum antigo).
 */
async function insertServiceLogResilient(
  supabase: ReturnType<typeof createClient>,
  full: ServiceLogInsert
): Promise<{ id: string; degraded: boolean }> {
  const attempts: ServiceLogInsert[] = [
    full,
    { ...full, payment_method: 'mixed' } as ServiceLogInsert,
    stripPaymentDateFields(full),
    { ...stripPaymentDateFields(full), payment_method: 'mixed' } as ServiceLogInsert,
    { ...stripPaymentDateFields(full), payment_method: 'fresha' } as ServiceLogInsert,
  ]

  let lastErr: unknown
  for (let i = 0; i < attempts.length; i++) {
    const res = await supabase
      .from('service_logs')
      .insert(attempts[i])
      .select('id')
      .single()
    if (!res.error && res.data?.id) {
      return { id: res.data.id, degraded: i > 0 }
    }
    lastErr = res.error
  }
  throw lastErr ?? new Error('Insert em service_logs falhou.')
}

export function RevenueEntryPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [sessionReady, setSessionReady] = useState(false)
  const [history, setHistory] = useState<ServiceLogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null)

  const [clientName, setClientName] = useState('')
  const [serviceNameManual, setServiceNameManual] = useState('')
  const [totalStr, setTotalStr] = useState('')
  const [advanceStr, setAdvanceStr] = useState('')
  const [remainingStr, setRemainingStr] = useState('')
  const [paymentMethod, setPaymentMethod] =
    useState<RevenuePaymentMethod>('fresha')
  const [advancePaidOnStr, setAdvancePaidOnStr] = useState(todayYmd)
  const [remainingPaidOnStr, setRemainingPaidOnStr] = useState(todayYmd)

  const totalPreview = roundMoney(parseEuro(totalStr))
  const advancePreview = roundMoney(parseEuro(advanceStr))
  const remainingPreview = roundMoney(parseEuro(remainingStr))

  const loadHistory = useCallback(async () => {
    setLoading(true)
    try {
      const histRes = await supabase
        .from('service_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(60)
      if (histRes.error) {
        toast.error(formatSupabaseError(histRes.error))
      }
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
      await loadHistory()
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router, loadHistory])

  useEffect(() => {
    if (!sessionReady) return
    const channel = supabase
      .channel('revenue-entry-logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_logs' },
        () => {
          void loadHistory()
        }
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [sessionReady, supabase, loadHistory])

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

  const resetForm = () => {
    setClientName('')
    setServiceNameManual('')
    setTotalStr('')
    setAdvanceStr('')
    setRemainingStr('')
    setPaymentMethod('fresha')
    setAdvancePaidOnStr(todayYmd())
    setRemainingPaidOnStr(todayYmd())
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

    if (advance > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(advancePaidOnStr.trim())) {
      toast.error('Indica a data em que o sinal foi pago.')
      return
    }
    if (remaining > 0 && !/^\d{4}-\d{2}-\d{2}$/.test(remainingPaidOnStr.trim())) {
      toast.error('Indica a data em que o saldo foi pago na loja.')
      return
    }

    let advanceTs = ''
    let remainingTs = ''
    try {
      if (advance > 0) advanceTs = dateStrToCashFlowTimestamp(advancePaidOnStr)
      if (remaining > 0)
        remainingTs = dateStrToCashFlowTimestamp(remainingPaidOnStr)
    } catch {
      toast.error('Datas de pagamento inválidas.')
      return
    }

    const est = 0
    const profit = roundMoney(total - est)
    const displayServiceName = serviceNameManual.trim() || null

    const logPayload: ServiceLogInsert = {
      service_id: null,
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
      advance_paid_on: advance > 0 ? advancePaidOnStr.trim() : null,
      remaining_paid_on: remaining > 0 ? remainingPaidOnStr.trim() : null,
    }

    setSaving(true)
    try {
      const { id: newId, degraded } = await insertServiceLogResilient(
        supabase,
        logPayload
      )
      if (degraded) {
        toast.warning(
          'Registo guardado em modo compatível. Corre o SQL em supabase/apply_revenue_migrations_on_remote.sql no Supabase (Editor SQL) para alinhar a base com a app.',
          { duration: 9000 }
        )
      }

      const flows: Database['public']['Tables']['cash_flow']['Insert'][] = []
      if (advance > 0) {
        flows.push({
          type: 'income',
          category: 'service_advance',
          amount: advance,
          description: `Pagamento sinal (online) — ${name}`,
          service_log_id: newId,
          created_at: advanceTs,
        })
      }
      if (remaining > 0) {
        flows.push({
          type: 'income',
          category: 'service_payment',
          amount: remaining,
          description: `Pagamento final (loja) — ${name}`,
          service_log_id: newId,
          created_at: remainingTs,
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
      await loadHistory()
    } catch (err) {
      toast.error(formatSupabaseError(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteServiceLog = async (row: ServiceLogRow) => {
    const label = row.client_name ?? 'este registo'
    if (
      !window.confirm(
        `Eliminar o faturamento de ${label}?\n\nRemove as receitas (sinal / saldo) do fluxo de caixa e o registo do serviço. Os totais em Finanças e previsões atualizam-se em seguida.`
      )
    ) {
      return
    }
    setDeletingLogId(row.id)
    try {
      const { error: cfErr } = await supabase
        .from('cash_flow')
        .delete()
        .eq('service_log_id', row.id)
      if (cfErr) throw cfErr

      const { error: logErr } = await supabase
        .from('service_logs')
        .delete()
        .eq('id', row.id)
      if (logErr) throw logErr

      toast.success('Lançamento eliminado. Fluxo de caixa atualizado.')
      await loadHistory()
      router.refresh()
    } catch (err) {
      toast.error(formatSupabaseError(err))
    } finally {
      setDeletingLogId(null)
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
            <span className="font-medium">fluxo de caixa</span> (sinal + final). Podes
            indicar a <span className="font-medium">data de cada pagamento</span>{' '}
            (ex.: sinal num mês e saldo noutro).{' '}
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

            <div className="space-y-2">
              <label
                htmlFor="rev-service-manual"
                className="text-sm font-medium text-[var(--text-main)]"
              >
                Nome do serviço
              </label>
              <input
                id="rev-service-manual"
                value={serviceNameManual}
                onChange={(e) => setServiceNameManual(e.target.value)}
                className="min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)]"
                placeholder="Ex.: Manicure gel"
              />
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

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="rev-adv-date"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Data do pagamento do sinal
                </label>
                <input
                  id="rev-adv-date"
                  type="date"
                  value={advancePaidOnStr}
                  onChange={(e) => setAdvancePaidOnStr(e.target.value)}
                  disabled={advancePreview <= 0}
                  className={`min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50`}
                />
                <p className="text-xs text-[var(--text-main)]/55">
                  O sinal entra no fluxo de caixa nesta data.
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="rev-rem-date"
                  className="text-sm font-medium text-[var(--text-main)]"
                >
                  Data do pagamento do saldo (loja)
                </label>
                <input
                  id="rev-rem-date"
                  type="date"
                  value={remainingPaidOnStr}
                  onChange={(e) => setRemainingPaidOnStr(e.target.value)}
                  disabled={remainingPreview <= 0}
                  className={`min-h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 text-base text-[var(--text-main)] outline-none focus:border-[var(--gold)] disabled:cursor-not-allowed disabled:opacity-50`}
                />
                <p className="text-xs text-[var(--text-main)]/55">
                  O saldo entra no fluxo de caixa nesta data.
                </p>
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
                Método de pagamento
              </legend>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {REVENUE_PAYMENT_OPTIONS.map(([val, label]) => (
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
          <>
          <p className="mt-2 text-xs text-[var(--text-main)]/55 md:hidden">
            Desliza a tabela para a direita para ver o botão de eliminar.
          </p>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-soft)]/60 text-xs uppercase tracking-wide text-[var(--text-main)]/65">
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="max-w-[14rem] px-4 py-3 font-medium">
                    Descrição
                  </th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Sinal</th>
                  <th className="px-4 py-3 font-medium">Saldo</th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Método de pagamento
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Data sinal
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Data saldo
                  </th>
                  <th className="whitespace-nowrap px-4 py-3 font-medium">
                    Registado
                  </th>
                  <th className="sticky right-0 z-[1] border-l border-[var(--border)] bg-[var(--bg-soft)]/95 px-4 py-3 text-right font-medium shadow-[-6px_0_14px_rgba(138,92,74,0.08)] backdrop-blur-sm">
                    Ações
                  </th>
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
                    <td className="max-w-[14rem] px-4 py-3 text-[var(--text-main)]/85">
                      <span
                        className="line-clamp-2 block break-words"
                        title={
                          row.service_name?.trim()
                            ? row.service_name.trim()
                            : undefined
                        }
                      >
                        {row.service_name?.trim() ? row.service_name.trim() : '—'}
                      </span>
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
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/85">
                      {paymentMethodLabel(row.payment_method)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/80">
                      {Number(row.advance_paid) > 0
                        ? formatPtDateOnly(row.advance_paid_on)
                        : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/80">
                      {Number(row.remaining_paid) > 0
                        ? formatPtDateOnly(row.remaining_paid_on)
                        : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/55">
                      {new Intl.DateTimeFormat('pt-PT', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      }).format(new Date(row.created_at))}
                    </td>
                    <td className="sticky right-0 z-[1] border-l border-[var(--border)] bg-[var(--bg-card)]/95 px-3 py-2 text-right shadow-[-6px_0_14px_rgba(138,92,74,0.08)] backdrop-blur-sm">
                      <button
                        type="button"
                        onClick={() => void handleDeleteServiceLog(row)}
                        disabled={deletingLogId === row.id}
                        title="Eliminar este lançamento e linhas no fluxo de caixa"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#c48080]/50 bg-[var(--highlight)]/40 px-3 py-2 text-xs font-semibold text-[#8a3c3c] transition-colors hover:bg-[#c48080]/15 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                        {deletingLogId === row.id ? 'A remover…' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
