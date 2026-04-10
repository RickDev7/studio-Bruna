'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { startOfMonth, subMonths } from 'date-fns'
import { Button } from '@/components/ui/button'
import { createClient } from '@/config/supabase-client'
import {
  BASE_SECURITY_EUR,
  STOCK_RESERVE_EUR,
  computeDistribution,
  computeNetBalance,
  roundMoney,
} from '@/lib/admin/finance'
import {
  buildCumulativeCashFlow,
  buildProjectionPoints,
  computeCurrentBalance,
  computeFinanceAlerts,
  mergeFinanceChartSeries,
  sumPendingPayments,
} from '@/lib/admin/financeIntelligence'
import {
  computeMonthProfitBreakdown,
  monthlyFinalProfitsDescending,
  profitGrowingTwoPlusMonths,
  type CashFlowMonthSlice,
  type ServiceLogMonthSlice,
} from '@/lib/admin/monthlyProfit'
import { computeSmartInsights } from '@/lib/admin/smartInsights'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import type { Database } from '@/types/database.types'
import { toast } from 'sonner'
import {
  AdminCashFlowCard,
  type CashFlowTotals,
} from './dashboard/AdminCashFlowCard'
import { AdminDistributionCard } from './dashboard/AdminDistributionCard'
import { AdminFinanceCard } from './dashboard/AdminFinanceCard'
import { AdminHistorySection } from './dashboard/AdminHistorySection'
import { FinanceAlerts } from '@/components/admin/FinanceAlerts'
import { FinanceChart } from '@/components/admin/FinanceChart'
import { FinanceSummary } from '@/components/admin/FinanceSummary'
import { MonthlyProfit } from '@/components/admin/MonthlyProfit'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { SmartInsights } from '@/components/admin/SmartInsights'
import { RevenueForecast } from '@/components/admin/RevenueForecast'

type FinancialLogRow = Database['public']['Tables']['financial_logs']['Row']
type CashFlowRow = Database['public']['Tables']['cash_flow']['Row']
type PaymentRow = Database['public']['Tables']['payments']['Row']
type ServiceCatalogRow = Pick<
  Database['public']['Tables']['services']['Row'],
  'id' | 'name' | 'price' | 'estimated_cost'
>

function parseBalanceInput(raw: string): number {
  const n = parseFloat(raw.replace(',', '.').replace(/\s/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function AdminFinancasPage() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [sessionReady, setSessionReady] = useState(false)
  const [totalBalanceInput, setTotalBalanceInput] = useState('')
  const [financialLogs, setFinancialLogs] = useState<FinancialLogRow[]>([])
  const [cashFlows, setCashFlows] = useState<CashFlowRow[]>([])
  const [cashFlowsSeries, setCashFlowsSeries] = useState<CashFlowRow[]>([])
  const [pendingPayments, setPendingPayments] = useState<PaymentRow[]>([])
  const [servicesCatalog, setServicesCatalog] = useState<ServiceCatalogRow[]>(
    []
  )
  const [cashFlowWindowRows, setCashFlowWindowRows] = useState<
    CashFlowMonthSlice[]
  >([])
  const [serviceLogWindowRows, setServiceLogWindowRows] = useState<
    ServiceLogMonthSlice[]
  >([])
  const [cashFlowTotals, setCashFlowTotals] = useState<CashFlowTotals>({
    income: 0,
    expense: 0,
  })
  const [loading, setLoading] = useState(true)
  const [savingFinance, setSavingFinance] = useState(false)
  const [deletingCashFlowId, setDeletingCashFlowId] = useState<string | null>(
    null
  )
  const [metricsAt, setMetricsAt] = useState(() => new Date())

  const accumulatedEmergency = useMemo(
    () =>
      financialLogs.reduce((s, row) => s + Number(row.emergency), 0),
    [financialLogs]
  )

  const totalBalance = parseBalanceInput(totalBalanceInput)
  const netBalance = roundMoney(computeNetBalance(totalBalance))
  const distribution = useMemo(() => {
    const d = computeDistribution(netBalance, accumulatedEmergency)
    return {
      ...d,
      salary: roundMoney(d.salary),
      investment: roundMoney(d.investment),
      emergency: roundMoney(d.emergency),
    }
  }, [netBalance, accumulatedEmergency])

  const {
    currentCashBalance,
    pendingPayTotal,
    forecastBalance,
    financeChartData,
    financeAlerts,
  } = useMemo(() => {
    const current = computeCurrentBalance(
      cashFlowTotals.income,
      cashFlowTotals.expense
    )
    const pending = sumPendingPayments(pendingPayments)
    const forecast = roundMoney(current - pending)
    const cum = buildCumulativeCashFlow(cashFlowsSeries)
    const proj = buildProjectionPoints(
      current,
      pendingPayments,
      new Date(),
      30
    )
    const chartData = mergeFinanceChartSeries(cum, proj)
    const alerts = computeFinanceAlerts(current, pending, forecast)
    return {
      currentCashBalance: current,
      pendingPayTotal: pending,
      forecastBalance: forecast,
      financeChartData: chartData,
      financeAlerts: alerts,
    }
  }, [cashFlowTotals, pendingPayments, cashFlowsSeries])

  const monthProfitBreakdown = useMemo(
    () =>
      computeMonthProfitBreakdown(
        cashFlowWindowRows,
        serviceLogWindowRows,
        metricsAt
      ),
    [cashFlowWindowRows, serviceLogWindowRows, metricsAt]
  )

  const profitGrowing = useMemo(() => {
    const series = monthlyFinalProfitsDescending(
      cashFlowWindowRows,
      serviceLogWindowRows,
      metricsAt,
      4
    )
    return profitGrowingTwoPlusMonths(series)
  }, [cashFlowWindowRows, serviceLogWindowRows, metricsAt])

  const smartInsightList = useMemo(
    () =>
      computeSmartInsights({
        monthlyFinalProfit: monthProfitBreakdown.finalProfit,
        forecastBalance,
        profitGrowingTwoPlusMonths: profitGrowing,
      }),
    [monthProfitBreakdown.finalProfit, forecastBalance, profitGrowing]
  )

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const windowStart = startOfMonth(subMonths(new Date(), 3))
      const windowIso = windowStart.toISOString()

      const [
        logsRes,
        cfListRes,
        cfAggRes,
        cfSeriesRes,
        pendingRes,
        servicesRes,
        cfWindowRes,
        serviceLogsRes,
      ] = await Promise.all([
        supabase
          .from('financial_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('cash_flow')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(80),
        supabase.from('cash_flow').select('type, amount'),
        supabase
          .from('cash_flow')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(2500),
        supabase.from('payments').select('*').eq('status', 'pending'),
        supabase
          .from('services')
          .select('id, name, price, estimated_cost')
          .or('active.eq.true,active.is.null')
          .order('name'),
        supabase
          .from('cash_flow')
          .select('type, amount, category, created_at')
          .gte('created_at', windowIso),
        supabase
          .from('service_logs')
          .select('profit, total_revenue, created_at')
          .gte('created_at', windowIso),
      ])

      const problems: string[] = []
      if (logsRes.error) {
        problems.push(`Finanças: ${formatSupabaseError(logsRes.error)}`)
      }
      const cfErr =
        cfListRes.error ??
        cfAggRes.error ??
        cfSeriesRes.error ??
        cfWindowRes.error
      if (cfErr) {
        problems.push(`Fluxo de caixa: ${formatSupabaseError(cfErr)}`)
      }
      if (pendingRes.error) {
        problems.push(
          `Contas a pagar: ${formatSupabaseError(pendingRes.error)}`
        )
      }
      if (servicesRes.error) {
        problems.push(`Serviços: ${formatSupabaseError(servicesRes.error)}`)
      }
      if (serviceLogsRes.error) {
        problems.push(
          `Registos de serviço: ${formatSupabaseError(serviceLogsRes.error)}`
        )
      }

      setFinancialLogs((logsRes.data as FinancialLogRow[]) ?? [])
      setCashFlows((cfListRes.data as CashFlowRow[]) ?? [])
      setCashFlowsSeries((cfSeriesRes.data as CashFlowRow[]) ?? [])
      setPendingPayments((pendingRes.data as PaymentRow[]) ?? [])
      setServicesCatalog((servicesRes.data as ServiceCatalogRow[]) ?? [])
      setCashFlowWindowRows(
        (cfWindowRes.data as CashFlowMonthSlice[]) ?? []
      )
      setServiceLogWindowRows(
        (serviceLogsRes.data as ServiceLogMonthSlice[]) ?? []
      )

      let cfIncome = 0
      let cfExpense = 0
      for (const r of (cfAggRes.data ?? []) as Pick<
        CashFlowRow,
        'type' | 'amount'
      >[]) {
        const a = Number(r.amount)
        if (!Number.isFinite(a)) continue
        if (r.type === 'income') cfIncome += a
        else cfExpense += a
      }
      setCashFlowTotals({
        income: roundMoney(cfIncome),
        expense: roundMoney(cfExpense),
      })
      setMetricsAt(new Date())

      if (problems.length > 0) {
        console.warn('[admin financas]', problems.join(' | '))
        toast.error(problems.join(' · '))
      }
    } catch (e) {
      const msg = formatSupabaseError(e)
      console.error('[admin financas]', msg, e)
      toast.error(msg)
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
      await refreshData()
    })()
    return () => {
      cancelled = true
    }
  }, [supabase, router, refreshData])

  useEffect(() => {
    if (!sessionReady) return
    const channel = supabase
      .channel('admin-financas-overview')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cash_flow' },
        () => {
          void refreshData()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments' },
        () => {
          void refreshData()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'service_logs' },
        () => {
          void refreshData()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'stock_movements' },
        () => {
          void refreshData()
        }
      )
      .subscribe((status) => {
        if (process.env.NODE_ENV !== 'development') return
        if (status === 'SUBSCRIBED') {
          console.info(
            '[admin financas] Realtime: cash_flow, payments, service_logs, stock_movements.'
          )
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn('[admin financas] Realtime:', status)
        }
      })
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [sessionReady, supabase, refreshData])

  const handleDeleteCashFlow = async (row: CashFlowRow) => {
    const detail = row.stock_movement_id
      ? 'O movimento de stock no histórico mantém-se; só esta linha do fluxo de caixa é removida.'
      : row.payment_id
        ? 'O pagamento associado mantém o estado «pago»; só esta linha do fluxo é removida.'
        : 'Esta transação será removida do fluxo de caixa.'
    if (
      !window.confirm(
        `Eliminar esta transação?\n\n${detail}`
      )
    ) {
      return
    }
    setDeletingCashFlowId(row.id)
    try {
      const { error } = await supabase.from('cash_flow').delete().eq('id', row.id)
      if (error) throw error
      toast.success('Transação eliminada.')
      await refreshData()
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setDeletingCashFlowId(null)
    }
  }

  const handleSaveLog = async () => {
    if (distribution.mode === 'negative_net') return
    setSavingFinance(true)
    try {
      const row = {
        total_balance: totalBalance,
        base_security: BASE_SECURITY_EUR,
        stock_reserved: STOCK_RESERVE_EUR,
        net_balance: netBalance,
        salary: distribution.salary,
        investment: distribution.investment,
        emergency: distribution.emergency,
      }
      const { error } = await supabase.from('financial_logs').insert(row)
      if (error) throw error
      toast.success('Registo financeiro guardado.')
      setTotalBalanceInput('')
      await refreshData()
    } catch (e) {
      console.error('[admin save log]', formatSupabaseError(e), e)
      toast.error(formatSupabaseError(e))
    } finally {
      setSavingFinance(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  if (!sessionReady && loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-main)]/60">
        A verificar sessão…
      </div>
    )
  }

  return (
    <div className="space-y-10 md:space-y-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-main)] md:text-4xl">
            Finanças
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-main)]/70">
            Saldo, distribuição e fluxo de caixa ligado ao stock.{' '}
            <Link
              href="/admin"
              className="font-medium text-[var(--gold)] underline decoration-[var(--border)] underline-offset-2 transition-colors hover:decoration-[var(--gold)]"
            >
              Stock e histórico completo
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)]"
          >
            <Link href="/admin/pagamentos">Pagamentos</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={signOut}
            className="rounded-xl border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)]"
          >
            Terminar sessão
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <AdminFinanceCard
          totalBalanceInput={totalBalanceInput}
          onTotalBalanceChange={setTotalBalanceInput}
          netBalance={netBalance}
          distribution={distribution}
          onSaveLog={handleSaveLog}
          saving={savingFinance}
        />
        <AdminDistributionCard
          distribution={distribution}
          netBalance={netBalance}
          accumulatedEmergency={roundMoney(accumulatedEmergency)}
        />
      </div>

      <div className="space-y-8">
        <FinanceSummary
          currentBalance={currentCashBalance}
          pendingExpenses={pendingPayTotal}
          forecastBalance={forecastBalance}
          loading={loading}
        />
        <FinanceChart data={financeChartData} loading={loading} />
        <FinanceAlerts alerts={financeAlerts} loading={loading} />
      </div>

      <div className="space-y-8">
        <MonthlyProfit
          breakdown={monthProfitBreakdown}
          loading={loading}
          referenceMonth={metricsAt}
        />
        <RevenueForecast
          serviceLogs={serviceLogWindowRows}
          cashFlowRows={cashFlowWindowRows}
          loading={loading}
          referenceDate={metricsAt}
        />
        <ServiceForm
          services={servicesCatalog}
          loading={loading}
          onLogged={refreshData}
        />
        <SmartInsights insights={smartInsightList} loading={loading} />
      </div>

      <AdminCashFlowCard
        rows={cashFlows}
        totals={cashFlowTotals}
        loading={loading}
        onDeleteCashFlow={handleDeleteCashFlow}
        deletingCashFlowId={deletingCashFlowId}
      />

      <AdminHistorySection
        financialLogs={financialLogs}
        stockMovements={[]}
        loading={loading}
        showStockMovements={false}
      />
    </div>
  )
}
