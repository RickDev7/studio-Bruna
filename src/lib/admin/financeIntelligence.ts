import { addDays, format, parseISO, startOfDay } from 'date-fns'
import { roundMoney } from '@/lib/admin/finance'
import type { Database } from '@/types/database.types'

type CashFlowRow = Database['public']['Tables']['cash_flow']['Row']
type PaymentRow = Database['public']['Tables']['payments']['Row']

export type CumulativePoint = { t: number; balance: number }

export function computeCurrentBalance(
  incomeTotal: number,
  expenseTotal: number
): number {
  return roundMoney(incomeTotal - expenseTotal)
}

export function sumPendingPayments(payments: Pick<PaymentRow, 'amount'>[]): number {
  return roundMoney(
    payments.reduce((s, p) => s + Number(p.amount), 0)
  )
}

export function buildCumulativeCashFlow(rows: CashFlowRow[]): CumulativePoint[] {
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  let bal = 0
  const out: CumulativePoint[] = []
  for (const r of sorted) {
    const a = Number(r.amount)
    if (!Number.isFinite(a) || a <= 0) continue
    if (r.type === 'income') bal += a
    else bal -= a
    out.push({
      t: new Date(r.created_at).getTime(),
      balance: roundMoney(bal),
    })
  }
  return out
}

/** Saldo após cada dia, durante `days` dias a partir de `fromDate`, descontando pendentes por due_date. */
export function buildProjectionPoints(
  currentBalance: number,
  pendingPayments: Pick<PaymentRow, 'due_date' | 'amount'>[],
  fromDate: Date,
  days: number
): CumulativePoint[] {
  const start = startOfDay(fromDate)
  const byDay = new Map<string, number>()
  let overdueImmediate = 0
  for (const p of pendingPayments) {
    const amt = Number(p.amount)
    if (!Number.isFinite(amt)) continue
    const due = startOfDay(parseISO(p.due_date))
    if (due.getTime() < start.getTime()) {
      overdueImmediate += amt
      continue
    }
    const key = format(due, 'yyyy-MM-dd')
    byDay.set(key, (byDay.get(key) ?? 0) + amt)
  }
  const out: CumulativePoint[] = []
  let bal = roundMoney(currentBalance - overdueImmediate)
  out.push({ t: start.getTime(), balance: bal })
  for (let i = 1; i <= days; i++) {
    const d = addDays(start, i)
    const key = format(d, 'yyyy-MM-dd')
    const hit = byDay.get(key) ?? 0
    bal = roundMoney(bal - hit)
    out.push({ t: d.getTime(), balance: bal })
  }
  return out
}

export type FinanceChartDatum = {
  t: number
  saldoReal: number | null
  projecao: number | null
}

export function mergeFinanceChartSeries(
  cumulative: CumulativePoint[],
  projection: CumulativePoint[]
): FinanceChartDatum[] {
  const map = new Map<number, FinanceChartDatum>()
  for (const p of cumulative) {
    map.set(p.t, {
      t: p.t,
      saldoReal: p.balance,
      projecao: null,
    })
  }
  for (const p of projection) {
    const cur = map.get(p.t)
    if (cur) {
      cur.projecao = p.balance
    } else {
      map.set(p.t, {
        t: p.t,
        saldoReal: null,
        projecao: p.balance,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => a.t - b.t)
}

export type FinanceAlert = {
  id: string
  tone: 'danger' | 'warning'
  message: string
}

const LOW_BALANCE_EUR = 200

export function computeFinanceAlerts(
  currentBalance: number,
  pendingTotal: number,
  forecastBalance: number
): FinanceAlert[] {
  const alerts: FinanceAlert[] = []
  if (forecastBalance < 0) {
    alerts.push({
      id: 'negative',
      tone: 'danger',
      message:
        'Cuidado: o saldo previsto após obrigações pendentes ficará negativo.',
    })
  }
  if (forecastBalance >= 0 && forecastBalance < LOW_BALANCE_EUR) {
    alerts.push({
      id: 'low',
      tone: 'warning',
      message: 'Saldo baixo previsto após pagar as despesas pendentes.',
    })
  }
  if (
    currentBalance > 0 &&
    pendingTotal > currentBalance * 0.7
  ) {
    alerts.push({
      id: 'high-expense',
      tone: 'warning',
      message:
        'Despesas pendentes elevadas em relação ao saldo atual do fluxo de caixa.',
    })
  }
  return alerts
}
