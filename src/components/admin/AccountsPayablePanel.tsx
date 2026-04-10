'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/config/supabase-client'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import { toast } from 'sonner'
import { CashForecast } from '@/components/admin/CashForecast'
import { MonthlySummary, type PaymentRow } from '@/components/admin/MonthlySummary'
import { PaymentsCard } from '@/components/admin/PaymentsCard'

export function AccountsPayablePanel() {
  const supabase = useMemo(() => createClient(), [])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [loading, setLoading] = useState(true)

  const loadPayments = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('due_date', { ascending: true })
      if (error) throw error
      setPayments((data as PaymentRow[]) ?? [])
    } catch (e) {
      toast.error(formatSupabaseError(e))
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-[var(--text-main)]/70">
        Resumo do mês, previsão de caixa e lista de obrigações. Ao marcar como
        pago, regista-se despesa no fluxo de caixa (categoria custo fixo).
      </p>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-[var(--text-main)]">
          Resumo mensal
        </h3>
        <MonthlySummary payments={payments} />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold tracking-wide text-[var(--text-main)]">
          Previsão
        </h3>
        <CashForecast payments={payments} />
      </section>

      <PaymentsCard
        payments={payments}
        loading={loading}
        onChanged={loadPayments}
      />
    </div>
  )
}
