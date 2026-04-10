import {
  endOfMonth,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { roundMoney } from '@/lib/admin/finance'

export type CashFlowMonthSlice = {
  type: 'income' | 'expense'
  amount: number
  created_at: string
  category?:
    | 'stock'
    | 'service'
    | 'service_advance'
    | 'service_payment'
    | 'other'
    | 'product_sale'
    | 'fixed_cost'
}

export type ServiceLogMonthSlice = {
  profit: number
  total_revenue: number
  created_at: string
}

export function cashFlowTotalsInMonth(
  rows: CashFlowMonthSlice[],
  month: Date
): { income: number; expense: number } {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  let income = 0
  let expense = 0
  for (const r of rows) {
    const t = new Date(r.created_at)
    if (!isWithinInterval(t, { start, end })) continue
    const a = Number(r.amount)
    if (!Number.isFinite(a)) continue
    if (r.type === 'income') income += a
    else expense += a
  }
  return {
    income: roundMoney(income),
    expense: roundMoney(expense),
  }
}

export function sumServiceProfitInMonth(
  rows: ServiceLogMonthSlice[],
  month: Date
): number {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  let s = 0
  for (const r of rows) {
    const t = new Date(r.created_at)
    if (!isWithinInterval(t, { start, end })) continue
    const p = Number(r.profit)
    if (Number.isFinite(p)) s += p
  }
  return roundMoney(s)
}

export type MonthProfitBreakdown = {
  income: number
  expense: number
  cashFlowNet: number
  serviceProfit: number
  finalProfit: number
}

export function computeMonthProfitBreakdown(
  cashRows: CashFlowMonthSlice[],
  serviceRows: ServiceLogMonthSlice[],
  month: Date
): MonthProfitBreakdown {
  const { income, expense } = cashFlowTotalsInMonth(cashRows, month)
  const cashFlowNet = roundMoney(income - expense)
  const serviceProfit = sumServiceProfitInMonth(serviceRows, month)
  return {
    income,
    expense,
    cashFlowNet,
    serviceProfit,
    finalProfit: roundMoney(cashFlowNet + serviceProfit),
  }
}

/** Índice 0 = mês atual, 1 = anterior, … */
export function monthlyFinalProfitsDescending(
  cashRows: CashFlowMonthSlice[],
  serviceRows: ServiceLogMonthSlice[],
  anchor: Date,
  count: number
): number[] {
  const out: number[] = []
  for (let i = 0; i < count; i++) {
    const m = subMonths(anchor, i)
    out.push(
      computeMonthProfitBreakdown(cashRows, serviceRows, m).finalProfit
    )
  }
  return out
}

/** Lucro a subir 2+ meses: mês atual > anterior > há dois meses */
export function profitGrowingTwoPlusMonths(
  profitsNewestFirst: number[]
): boolean {
  if (profitsNewestFirst.length < 3) return false
  const [a, b, c] = profitsNewestFirst
  return a > b && b > c
}
