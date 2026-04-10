'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/config/supabase-client'
import { roundMoney } from '@/lib/admin/finance'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import { toast } from 'sonner'
import {
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  format as formatDateFns,
  isBefore,
  parseISO,
  startOfDay,
} from 'date-fns'
import { formatEUR } from '@/components/admin/dashboard/format'
import type { PaymentRow } from '@/components/admin/MonthlySummary'

type Filter = 'all' | 'pending' | 'paid' | 'overdue'

type Props = {
  payments: PaymentRow[]
  loading: boolean
  onChanged: () => void | Promise<void>
}

function formatDueLabel(iso: string) {
  return new Intl.DateTimeFormat('pt-PT', { dateStyle: 'medium' }).format(
    parseISO(iso)
  )
}

function rowAlert(p: PaymentRow): 'overdue' | 'upcoming' | null {
  if (p.status === 'paid') return null
  const due = startOfDay(parseISO(p.due_date))
  const today = startOfDay(new Date())
  if (isBefore(due, today)) return 'overdue'
  const days = differenceInCalendarDays(due, today)
  if (days >= 0 && days <= 3) return 'upcoming'
  return null
}

function rowShellClass(alert: ReturnType<typeof rowAlert>, paid: boolean) {
  if (paid) {
    return 'border-[var(--border)] bg-[var(--bg-main)]/25'
  }
  if (alert === 'overdue') {
    return 'border-[#e8b4b4]/80 bg-[#fdf2f2]/90'
  }
  if (alert === 'upcoming') {
    return 'border-[#e8d4a8]/90 bg-[#fdfbf0]/95'
  }
  return 'border-[var(--border)] bg-[var(--bg-main)]/35'
}

export function PaymentsCard({ payments, loading, onChanged }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [filter, setFilter] = useState<Filter>('all')
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'paid'>('pending')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState<'monthly' | 'weekly'>(
    'monthly'
  )
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const today = startOfDay(new Date())
    return payments.filter((p) => {
      if (filter === 'all') return true
      if (filter === 'pending') return p.status === 'pending'
      if (filter === 'paid') return p.status === 'paid'
      if (filter === 'overdue') {
        if (p.status !== 'pending') return false
        return isBefore(startOfDay(parseISO(p.due_date)), today)
      }
      return true
    })
  }, [payments, filter])

  const parseAmount = (): number | null => {
    const n = parseFloat(amount.trim().replace(',', '.'))
    if (!Number.isFinite(n) || n <= 0) return null
    return roundMoney(n)
  }

  const insertCashFlowOnce = async (p: PaymentRow) => {
    const { data: dup } = await supabase
      .from('cash_flow')
      .select('id')
      .eq('payment_id', p.id)
      .maybeSingle()
    if (dup) return
    const { error } = await supabase.from('cash_flow').insert({
      type: 'expense',
      category: 'fixed_cost',
      amount: Number(p.amount),
      description: p.title,
      payment_id: p.id,
    })
    if (error) throw error
  }

  const spawnNextRecurring = async (p: PaymentRow) => {
    if (!p.is_recurring || !p.recurrence_type) return
    const base = parseISO(p.due_date)
    const next =
      p.recurrence_type === 'monthly' ? addMonths(base, 1) : addWeeks(base, 1)
    const nextStr = formatDateFns(next, 'yyyy-MM-dd')
    const { error } = await supabase.from('payments').insert({
      title: p.title,
      amount: p.amount,
      status: 'pending',
      due_date: nextStr,
      is_recurring: true,
      recurrence_type: p.recurrence_type,
    })
    if (error) throw error
  }

  const handleAdd = async () => {
    const t = title.trim()
    const amt = parseAmount()
    if (!t) {
      toast.error('Indica o título.')
      return
    }
    if (amt == null) {
      toast.error('Indica um montante válido (> 0).')
      return
    }
    if (!dueDate) {
      toast.error('Indica a data de vencimento.')
      return
    }
    if (isRecurring && !recurrenceType) {
      toast.error('Escolhe o tipo de recorrência.')
      return
    }
    setSaving(true)
    try {
      const { data: row, error } = await supabase
        .from('payments')
        .insert({
          title: t,
          amount: amt,
          status,
          due_date: dueDate,
          is_recurring: isRecurring,
          recurrence_type: isRecurring ? recurrenceType : null,
        })
        .select()
        .single()
      if (error) throw error
      if (row && row.status === 'paid') {
        await insertCashFlowOnce(row as PaymentRow)
        if (row.is_recurring) {
          await spawnNextRecurring(row as PaymentRow)
        }
      }
      toast.success('Pagamento criado.')
      setTitle('')
      setAmount('')
      setDueDate('')
      setStatus('pending')
      setIsRecurring(false)
      setRecurrenceType('monthly')
      setShowForm(false)
      await onChanged()
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setSaving(false)
    }
  }

  const handleMarkPaid = async (p: PaymentRow) => {
    if (p.status === 'paid') return
    setBusyId(p.id)
    try {
      const { error: u } = await supabase
        .from('payments')
        .update({ status: 'paid' })
        .eq('id', p.id)
      if (u) throw u
      await insertCashFlowOnce(p)
      if (p.is_recurring) {
        await spawnNextRecurring(p)
      }
      toast.success('Marcado como pago.')
      await onChanged()
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (p: PaymentRow) => {
    if (!window.confirm(`Eliminar o pagamento «${p.title}»?`)) return
    setBusyId(p.id)
    try {
      const { error } = await supabase.from('payments').delete().eq('id', p.id)
      if (error) throw error
      toast.success('Pagamento eliminado.')
      await onChanged()
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-6 p-6 md:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
              Contas a pagar
            </h2>
            <p className="mt-2 text-sm text-[var(--text-main)]/75">
              Despesas fixas e fornecedores. Ao marcar como pago, regista-se
              despesa no fluxo de caixa.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none hover:bg-[var(--highlight)]"
          >
            {showForm ? 'Fechar formulário' : 'Novo pagamento'}
          </Button>
        </div>

        {showForm && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/70 p-5">
            <h3 className="mb-4 text-sm font-semibold text-[var(--text-main)]">
              Adicionar pagamento
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
                  Título
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-field w-full px-3 py-2.5 text-sm"
                  placeholder="Ex.: Renda, energia, software…"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
                  Montante (€)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  className="admin-field w-full px-3 py-2.5 text-sm"
                  placeholder="0,00"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
                  Data de vencimento
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="admin-field w-full px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
                  Estado inicial
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as 'pending' | 'paid')
                  }
                  className="admin-field w-full px-3 py-2.5 text-sm"
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                </select>
              </div>
              <div className="flex flex-col justify-end gap-3 md:col-span-2 md:flex-row md:items-center">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--text-main)]">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-[var(--border)]"
                  />
                  Pagamento recorrente
                </label>
                {isRecurring && (
                  <select
                    value={recurrenceType}
                    onChange={(e) =>
                      setRecurrenceType(e.target.value as 'monthly' | 'weekly')
                    }
                    className="admin-field max-w-xs px-3 py-2 text-sm"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="weekly">Semanal</option>
                  </select>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={saving}
                onClick={handleAdd}
                className="rounded-xl border-0 bg-[var(--gold)] text-white shadow-none hover:brightness-[0.92]"
              >
                {saving ? 'A guardar…' : 'Guardar'}
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(
            [
              ['all', 'Todos'],
              ['pending', 'Pendentes'],
              ['paid', 'Pagos'],
              ['overdue', 'Atrasados'],
            ] as const
          ).map(([key, label]) => (
            <Button
              key={key}
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFilter(key)}
              className={`rounded-xl border shadow-none transition-all duration-300 ${
                filter === key
                  ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                  : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
              }`}
            >
              {label}
            </Button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-main)]/65">A carregar…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[var(--text-main)]/65">
            Nenhum pagamento neste filtro.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((p) => {
              const alert = rowAlert(p)
              const paid = p.status === 'paid'
              return (
                <li
                  key={p.id}
                  className={`rounded-2xl border px-4 py-4 transition-colors ${rowShellClass(
                    alert,
                    paid
                  )}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-[var(--text-main)]">
                          {p.title}
                        </p>
                        {p.is_recurring && (
                          <span className="rounded-full border border-[var(--border)] bg-[var(--bg-soft)] px-2 py-0.5 text-xs font-medium text-[var(--text-main)]/80">
                            {p.recurrence_type === 'weekly'
                              ? 'Semanal'
                              : 'Mensal'}
                          </span>
                        )}
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            paid
                              ? 'bg-[#e8f2ea] text-[#4a7c59]'
                              : 'bg-[var(--bg-main)] text-[var(--text-main)]/80'
                          }`}
                        >
                          {paid ? 'Pago' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-main)]/70">
                        Vencimento: {formatDueLabel(p.due_date)}
                      </p>
                      <p className="text-lg font-semibold tabular-nums text-[var(--gold)]">
                        {formatEUR(Number(p.amount))}
                      </p>
                      {alert === 'overdue' && (
                        <p className="text-sm font-medium text-[#b85858]">
                          Pagamento atrasado
                        </p>
                      )}
                      {alert === 'upcoming' && (
                        <p className="text-sm font-medium text-[#a08030]">
                          Vencendo em breve
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!paid && (
                        <Button
                          type="button"
                          size="sm"
                          disabled={busyId === p.id}
                          onClick={() => handleMarkPaid(p)}
                          className="rounded-lg border-0 bg-[#6b9b7a] text-white shadow-none hover:brightness-95"
                        >
                          {busyId === p.id ? 'A atualizar…' : 'Marcar como pago'}
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={busyId === p.id}
                        onClick={() => handleDelete(p)}
                        className="rounded-lg border-[var(--border)] text-[#a85c5c] hover:bg-[var(--highlight)]"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
