import {
  endOfMonth,
  getDate,
  getDaysInMonth,
  isWithinInterval,
  startOfMonth,
  subMonths,
} from 'date-fns'
import { roundMoney } from '@/lib/admin/finance'
import type { CashFlowMonthSlice } from '@/lib/admin/monthlyProfit'

export type ServiceLogRevenueRow = {
  total_revenue: number
  created_at: string
}

export function sumServiceRevenueInMonth(
  rows: ServiceLogRevenueRow[],
  month: Date
): number {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  let s = 0
  for (const r of rows) {
    const t = new Date(r.created_at)
    if (!isWithinInterval(t, { start, end })) continue
    const v = Number(r.total_revenue)
    if (Number.isFinite(v)) s += v
  }
  return roundMoney(s)
}

/** Receitas em cash_flow classificadas como serviço (evita duplicar outras categorias). */
export function sumCashFlowServiceIncomeInMonth(
  rows: CashFlowMonthSlice[],
  month: Date
): number {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  let s = 0
  for (const r of rows) {
    if (
      r.type !== 'income' ||
      !(
        r.category === 'service' ||
        r.category === 'service_advance' ||
        r.category === 'service_payment'
      )
    )
      continue
    const t = new Date(r.created_at)
    if (!isWithinInterval(t, { start, end })) continue
    const a = Number(r.amount)
    if (Number.isFinite(a)) s += a
  }
  return roundMoney(s)
}

function combinedServiceRevenueInMonth(
  serviceRows: ServiceLogRevenueRow[],
  cashRows: CashFlowMonthSlice[],
  month: Date
): number {
  return roundMoney(
    sumServiceRevenueInMonth(serviceRows, month) +
      sumCashFlowServiceIncomeInMonth(cashRows, month)
  )
}

export type MonthlyRevenueForecastResult = {
  currentRevenue: number
  currentDay: number
  daysInMonth: number
  baseForecast: number
  adjustedForecast: number
  averageLastThreeMonths: number
  finalForecast: number
  lastMonthRevenue: number
  growthVsLastMonthPct: number | null
  insight: 'growing' | 'below' | 'neutral'
  /** Faturação por mês (mais antigo → mais recente), último = mês atual parcial */
  chartBars: { label: string; value: number }[]
}

const TREND_UP_MULT = 1.075
const TREND_DOWN_MULT = 0.95

export function computeMonthlyRevenueForecast(
  serviceRows: ServiceLogRevenueRow[],
  anchor: Date,
  cashFlowRows: CashFlowMonthSlice[] = []
): MonthlyRevenueForecastResult {
  const daysInMonth = getDaysInMonth(anchor)
  const currentDay = Math.max(1, getDate(anchor))

  const currentRevenue = combinedServiceRevenueInMonth(
    serviceRows,
    cashFlowRows,
    anchor
  )

  const baseForecast =
    currentDay > 0
      ? roundMoney((currentRevenue / currentDay) * daysInMonth)
      : 0

  const lastMonthDate = subMonths(anchor, 1)
  const lastMonthRevenue = combinedServiceRevenueInMonth(
    serviceRows,
    cashFlowRows,
    lastMonthDate
  )
  const daysLastMonth = getDaysInMonth(lastMonthDate)
  const paceCurrent = currentRevenue / currentDay
  const paceLast =
    daysLastMonth > 0 ? lastMonthRevenue / daysLastMonth : 0

  let adjustedForecast = baseForecast
  if (paceLast > 0) {
    if (paceCurrent > paceLast) {
      adjustedForecast = roundMoney(baseForecast * TREND_UP_MULT)
    } else if (paceCurrent < paceLast) {
      adjustedForecast = roundMoney(baseForecast * TREND_DOWN_MULT)
    }
  } else if (lastMonthRevenue <= 0 && currentRevenue > 0) {
    adjustedForecast = roundMoney(baseForecast * TREND_UP_MULT)
  }

  const prevSums: number[] = []
  for (let i = 1; i <= 3; i++) {
    prevSums.push(
      combinedServiceRevenueInMonth(
        serviceRows,
        cashFlowRows,
        subMonths(anchor, i)
      )
    )
  }
  const averageLastThreeMonths = roundMoney(
    prevSums.reduce((a, b) => a + b, 0) / 3
  )

  const finalForecast =
    averageLastThreeMonths > 0
      ? roundMoney((adjustedForecast + averageLastThreeMonths) / 2)
      : adjustedForecast

  let growthVsLastMonthPct: number | null = null
  if (lastMonthRevenue > 0) {
    growthVsLastMonthPct = Number(
      (
        ((finalForecast - lastMonthRevenue) / lastMonthRevenue) *
        100
      ).toFixed(1)
    )
  } else if (lastMonthRevenue === 0 && finalForecast > 0) {
    growthVsLastMonthPct = 100
  }

  let insight: MonthlyRevenueForecastResult['insight'] = 'neutral'
  if (finalForecast > lastMonthRevenue) insight = 'growing'
  else if (finalForecast < lastMonthRevenue) insight = 'below'

  const chartBars: MonthlyRevenueForecastResult['chartBars'] = []
  for (let i = 3; i >= 1; i--) {
    const d = subMonths(anchor, i)
    chartBars.push({
      label: `${d.getMonth() + 1}/${String(d.getFullYear()).slice(-2)}`,
      value: combinedServiceRevenueInMonth(serviceRows, cashFlowRows, d),
    })
  }
  chartBars.push({
    label: 'Este mês',
    value: currentRevenue,
  })

  return {
    currentRevenue: roundMoney(currentRevenue),
    currentDay,
    daysInMonth,
    baseForecast,
    adjustedForecast,
    averageLastThreeMonths,
    finalForecast,
    lastMonthRevenue: roundMoney(lastMonthRevenue),
    growthVsLastMonthPct,
    insight,
    chartBars,
  }
}
