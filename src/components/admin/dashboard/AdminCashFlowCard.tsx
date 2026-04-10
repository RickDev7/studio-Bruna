'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from '@/types/database.types'
import { roundMoney } from '@/lib/admin/finance'
import { formatEUR } from './format'

type CashFlowRow = Database['public']['Tables']['cash_flow']['Row']

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export type CashFlowTotals = { income: number; expense: number }

type Props = {
  rows: CashFlowRow[]
  totals: CashFlowTotals
  loading: boolean
  onDeleteCashFlow?: (row: CashFlowRow) => void | Promise<void>
  deletingCashFlowId?: string | null
}

export function AdminCashFlowCard({
  rows,
  totals,
  loading,
  onDeleteCashFlow,
  deletingCashFlowId,
}: Props) {
  const { totalIncome, totalExpense, net } = useMemo(() => {
    const income = roundMoney(totals.income)
    const expense = roundMoney(totals.expense)
    return {
      totalIncome: income,
      totalExpense: expense,
      net: roundMoney(income - expense),
    }
  }, [totals.income, totals.expense])

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-8 p-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Fluxo de caixa (stock)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/75">
            Movimentos de stock e pagamentos marcados como pagos criam entradas
            aqui. Podes excluir uma linha abaixo; eliminar um movimento no
            histórico de stock remove o registo ligado automaticamente.
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-main)]/65">A carregar…</p>
        ) : (
          <>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
                <dt className="text-xs font-medium text-[var(--text-main)]/65">
                  Total receitas
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-[#6b9b7a]">
                  {formatEUR(totalIncome)}
                </dd>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 px-4 py-3">
                <dt className="text-xs font-medium text-[var(--text-main)]/65">
                  Total despesas
                </dt>
                <dd className="mt-1 text-lg font-semibold tabular-nums text-[#c48080]">
                  {formatEUR(totalExpense)}
                </dd>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--highlight)]/50 px-4 py-3 sm:col-span-1">
                <dt className="text-xs font-medium text-[var(--text-main)]/65">
                  Saldo líquido
                </dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums text-[var(--gold)]">
                  {formatEUR(net)}
                </dd>
              </div>
            </dl>

            <div>
              <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--text-main)]">
                Transações
              </h3>
              {rows.length === 0 ? (
                <p className="text-sm text-[var(--text-main)]/65">
                  Ainda não há transações no fluxo de caixa.
                </p>
              ) : (
                <div className="admin-table-shell max-h-[min(22rem,50vh)] overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="admin-table-head sticky top-0 z-[1]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Valor</th>
                        <th className="px-4 py-3 font-medium">Descrição</th>
                        {onDeleteCashFlow && (
                          <th className="px-4 py-3 text-right font-medium">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-main)]/30">
                      {rows.map((row) => {
                        const isIncome = row.type === 'income'
                        return (
                          <tr
                            key={row.id}
                            className="admin-table-row border-0 bg-transparent"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/75">
                              {formatDate(row.created_at)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={
                                  isIncome
                                    ? 'font-medium text-[#6b9b7a]'
                                    : 'font-medium text-[#c48080]'
                                }
                              >
                                {row.type === 'income' ? 'Receita' : 'Despesa'}
                              </span>
                            </td>
                            <td
                              className={`px-4 py-3 tabular-nums font-medium ${
                                isIncome ? 'text-[#6b9b7a]' : 'text-[#c48080]'
                              }`}
                            >
                              {isIncome ? '+' : '−'}
                              {formatEUR(Number(row.amount))}
                            </td>
                            <td className="px-4 py-3 text-[var(--text-main)]/85">
                              {row.description}
                            </td>
                            {onDeleteCashFlow && (
                              <td className="px-4 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => onDeleteCashFlow(row)}
                                  disabled={deletingCashFlowId === row.id}
                                  className="rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[#a85c5c] transition-all duration-300 hover:bg-[var(--highlight)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {deletingCashFlowId === row.id
                                    ? 'A remover…'
                                    : 'Excluir'}
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
