'use client'

import { Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from '@/types/database.types'
import { stockUnitLabel } from '@/lib/admin/stockUnits'
import { formatEUR } from './format'

type FinancialLog = Database['public']['Tables']['financial_logs']['Row']
type StockMovement = Database['public']['Tables']['stock_movements']['Row'] & {
  products?: { name: string } | null
}

type Props = {
  financialLogs: FinancialLog[]
  stockMovements: StockMovement[]
  loading: boolean
  /** Quando false, mostra só a tabela de logs financeiros (ex.: página Finanças). */
  showStockMovements?: boolean
  onDeleteStockMovement?: (row: StockMovement) => void | Promise<void>
  deletingMovementId?: string | null
  onDeleteFinancialLog?: (row: FinancialLog) => void | Promise<void>
  deletingFinancialLogId?: string | null
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(iso))
}

export function AdminHistorySection({
  financialLogs,
  stockMovements,
  loading,
  showStockMovements = true,
  onDeleteStockMovement,
  deletingMovementId,
  onDeleteFinancialLog,
  deletingFinancialLogId,
}: Props) {
  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-8 p-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Histórico
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/75">
            {showStockMovements
              ? 'Registos financeiros e movimentos de stock.'
              : 'Registos financeiros guardados na base de dados.'}
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-main)]/65">A carregar…</p>
        ) : (
          <div
            className={
              showStockMovements ? 'grid gap-10 lg:grid-cols-2' : 'grid gap-10'
            }
          >
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-[var(--text-main)]">
                Logs financeiros
              </h3>
              {financialLogs.length === 0 ? (
                <p className="text-sm text-[var(--text-main)]/65">Sem registos.</p>
              ) : (
                <div className="admin-table-shell overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="admin-table-head">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Líq.</th>
                        <th className="px-4 py-3 font-medium">S / I / E</th>
                        {onDeleteFinancialLog ? (
                          <th className="sticky right-0 z-[1] border-l border-[var(--border)] bg-[var(--bg-soft)]/95 px-3 py-3 text-right text-xs font-medium shadow-[-6px_0_12px_rgba(138,92,74,0.06)]">
                            Ações
                          </th>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-main)]/30">
                      {financialLogs.map((row) => (
                        <tr
                          key={row.id}
                          className="admin-table-row border-0 bg-transparent"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/75">
                            {formatDate(row.created_at)}
                          </td>
                          <td className="px-4 py-3 tabular-nums text-[var(--gold)]">
                            {formatEUR(Number(row.total_balance))}
                          </td>
                          <td className="px-4 py-3 font-medium tabular-nums text-[var(--gold)]">
                            {formatEUR(Number(row.net_balance))}
                          </td>
                          <td className="px-4 py-3 tabular-nums text-xs text-[var(--text-main)]/70">
                            {formatEUR(Number(row.salary))} ·{' '}
                            {formatEUR(Number(row.investment))} ·{' '}
                            {formatEUR(Number(row.emergency))}
                          </td>
                          {onDeleteFinancialLog ? (
                            <td className="sticky right-0 z-[1] border-l border-[var(--border)] bg-[var(--bg-card)]/95 px-2 py-2 text-right shadow-[-6px_0_12px_rgba(138,92,74,0.06)]">
                              <button
                                type="button"
                                title="Eliminar este registo financeiro"
                                onClick={() => void onDeleteFinancialLog(row)}
                                disabled={deletingFinancialLogId === row.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-[#c48080]/45 bg-[var(--highlight)]/35 px-2 py-1.5 text-xs font-semibold text-[#8a3c3c] transition-colors hover:bg-[#c48080]/12 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                {deletingFinancialLogId === row.id
                                  ? '…'
                                  : 'Excluir'}
                              </button>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {showStockMovements ? (
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wide text-[var(--text-main)]">
                Movimentos de stock
              </h3>
              {stockMovements.length === 0 ? (
                <p className="text-sm text-[var(--text-main)]/65">Sem movimentos.</p>
              ) : (
                <div className="admin-table-shell overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="admin-table-head">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Produto</th>
                        <th className="px-4 py-3 font-medium">Tipo</th>
                        <th className="px-4 py-3 font-medium">Qtd</th>
                        <th className="px-4 py-3 font-medium">Un.</th>
                        <th className="px-4 py-3 font-medium">€ / un.</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        {onDeleteStockMovement && (
                          <th className="px-4 py-3 font-medium text-right">
                            Ações
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border)] bg-[var(--bg-main)]/30">
                      {stockMovements.map((row) => (
                        <tr
                          key={row.id}
                          className="admin-table-row border-0 bg-transparent"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-[var(--text-main)]/75">
                            {formatDate(row.created_at)}
                          </td>
                          <td className="px-4 py-3 text-[var(--text-main)]">
                            {row.products?.name ?? '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={
                                row.type === 'in'
                                  ? 'font-medium text-[var(--text-main)]'
                                  : 'font-medium text-[#a85c5c]'
                              }
                            >
                              {row.type === 'in' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td className="px-4 py-3 tabular-nums text-[var(--text-main)]">
                            {row.quantity}
                          </td>
                          <td className="px-4 py-3 text-xs text-[var(--text-main)]/80">
                            {row.unit_type
                              ? stockUnitLabel(row.unit_type)
                              : '—'}
                          </td>
                          <td className="px-4 py-3 tabular-nums text-[var(--text-main)]/85">
                            {row.unit_price != null &&
                            Number.isFinite(Number(row.unit_price))
                              ? formatEUR(Number(row.unit_price))
                              : '—'}
                          </td>
                          <td className="px-4 py-3 tabular-nums font-medium text-[var(--gold)]">
                            {row.total_price != null &&
                            Number.isFinite(Number(row.total_price))
                              ? formatEUR(Number(row.total_price))
                              : '—'}
                          </td>
                          {onDeleteStockMovement && (
                            <td className="px-4 py-3 text-right">
                              <button
                                type="button"
                                onClick={() => onDeleteStockMovement(row)}
                                disabled={deletingMovementId === row.id}
                                className="rounded-lg border border-[var(--border)] bg-transparent px-2.5 py-1 text-xs font-medium text-[#a85c5c] transition-all duration-300 hover:bg-[var(--highlight)] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingMovementId === row.id
                                  ? 'A remover…'
                                  : 'Excluir'}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
