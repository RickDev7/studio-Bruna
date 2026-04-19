'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from '@/types/database.types'
import { roundMoney } from '@/lib/admin/finance'
import { calculateTotal } from '@/lib/admin/stockCost'
import {
  STOCK_UNIT_OPTIONS,
  normalizeStockUnitType,
  stockUnitLabel,
} from '@/lib/admin/stockUnits'
import { formatEUR } from './format'

type ProductRow = Database['public']['Tables']['products']['Row']
type StockMovAgg = Pick<
  Database['public']['Tables']['stock_movements']['Row'],
  'type' | 'quantity' | 'unit_price' | 'total_price' | 'created_at'
>

function monthKeyEt(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function movementEuro(m: StockMovAgg): number {
  const tp = m.total_price
  if (tp != null && Number.isFinite(Number(tp))) return roundMoney(Number(tp))
  const up = m.unit_price
  if (up != null && Number.isFinite(Number(up))) {
    return roundMoney(Number(up) * Number(m.quantity))
  }
  return 0
}

function formatMonthHeading(ym: string): string {
  const [ys, ms] = ym.split('-')
  const y = Number(ys)
  const mo = Number(ms)
  if (!Number.isFinite(y) || !Number.isFinite(mo)) return ym
  return new Intl.DateTimeFormat('pt-PT', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, mo - 1, 1))
}

const STOCK_MONTH_FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos os meses do ano' },
  ...Array.from({ length: 12 }, (_, i) => {
    const m = String(i + 1).padStart(2, '0')
    const d = new Date(2000, i, 1)
    const raw = new Intl.DateTimeFormat('pt-PT', { month: 'long' }).format(d)
    const label = raw.charAt(0).toUpperCase() + raw.slice(1)
    return { value: m, label }
  }),
]

function aggregateStockByMonth(movements: StockMovAgg[]) {
  const map = new Map<string, { inSum: number; outSum: number }>()
  for (const m of movements) {
    const key = monthKeyEt(m.created_at)
    const v = movementEuro(m)
    const cur = map.get(key) ?? { inSum: 0, outSum: 0 }
    if (m.type === 'in') cur.inSum = roundMoney(cur.inSum + v)
    else cur.outSum = roundMoney(cur.outSum + v)
    map.set(key, cur)
  }
  const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a))
  return keys.map((month) => {
    const row = map.get(month)!
    return {
      month,
      label: formatMonthHeading(month),
      inSum: row.inSum,
      outSum: row.outSum,
      net: roundMoney(row.inSum - row.outSum),
    }
  })
}

export { STOCK_UNIT_OPTIONS, stockUnitLabel }

function parsePriceInput(raw: string): number | null {
  const s = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (!s) return null
  const n = parseFloat(s)
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null
}

function parseQtyInput(raw: string): number {
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

type CostDraft = { cost: string; unitType: string; sale: string }

type Props = {
  products: ProductRow[]
  /** Movimentos dos últimos meses (para resumo mensal). */
  stockMovements: StockMovAgg[]
  loading: boolean
  onAddProduct: (
    name: string,
    minStock: number,
    unitType: string,
    initialQty: number,
    costPerUnit: number | null,
    salePrice: number | null
  ) => Promise<boolean>
  onUpdateProductCost: (
    productId: string,
    unitType: string,
    costPerUnit: number | null,
    salePrice: number | null,
    currentStock: number
  ) => Promise<void>
  onDeleteProduct: (productId: string, productName: string) => Promise<void>
  onStockIn: (
    productId: string,
    quantity: number,
    unitPrice: number
  ) => Promise<void>
  onStockOut: (productId: string, quantity: number) => Promise<void>
}

export function AdminStockCard({
  products,
  stockMovements,
  loading,
  onAddProduct,
  onUpdateProductCost,
  onDeleteProduct,
  onStockIn,
  onStockOut,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('')
  /** Ano `YYYY` ou vazio = todos */
  const [filterYear, setFilterYear] = useState('')
  /** `01`–`12` ou vazio (só com ano): todos os meses desse ano */
  const [filterMonthPart, setFilterMonthPart] = useState('')
  const [newName, setNewName] = useState('')
  const [newMin, setNewMin] = useState('1')
  const [newUnitType, setNewUnitType] = useState('unit')
  const [newInitialQty, setNewInitialQty] = useState('0')
  const [newCost, setNewCost] = useState('')
  const [newSale, setNewSale] = useState('')
  const [qtyByProduct, setQtyByProduct] = useState<Record<string, string>>({})
  const [movPriceByProduct, setMovPriceByProduct] = useState<
    Record<string, string>
  >({})
  const [busy, setBusy] = useState<string | null>(null)
  const [costDraft, setCostDraft] = useState<Record<string, CostDraft>>({})

  useEffect(() => {
    const next: Record<string, CostDraft> = {}
    for (const p of products) {
      const c = p.cost_per_unit ?? p.unit_price
      const s = p.sale_price
      next[p.id] = {
        cost:
          c != null && !Number.isNaN(Number(c))
            ? String(c).replace('.', ',')
            : '',
        unitType: normalizeStockUnitType(p.unit_type),
        sale:
          s != null && !Number.isNaN(Number(s)) ? String(s).replace('.', ',') : '',
      }
    }
    setCostDraft(next)
  }, [products])

  useEffect(() => {
    setMovPriceByProduct((prev) => {
      const merged = { ...prev }
      for (const p of products) {
        if (merged[p.id] !== undefined) continue
        const c = p.cost_per_unit ?? p.unit_price
        if (c != null && !Number.isNaN(Number(c))) {
          merged[p.id] = String(c).replace('.', ',')
        } else {
          merged[p.id] = ''
        }
      }
      for (const id of Object.keys(merged)) {
        if (!products.some((p) => p.id === id)) delete merged[id]
      }
      return merged
    })
  }, [products])

  const setQty = (id: string, v: string) =>
    setQtyByProduct((prev) => ({ ...prev, [id]: v }))

  const setMovPrice = (id: string, v: string) =>
    setMovPriceByProduct((prev) => ({ ...prev, [id]: v }))

  const getQty = (id: string) => {
    const q = parseInt(qtyByProduct[id] || '1', 10)
    return Number.isFinite(q) && q > 0 ? q : 1
  }

  const getMovUnitPrice = (id: string) => parsePriceInput(movPriceByProduct[id] ?? '')

  const setDraft = (id: string, patch: Partial<CostDraft>) => {
    setCostDraft((prev) => ({
      ...prev,
      [id]: {
        cost: prev[id]?.cost ?? '',
        unitType: prev[id]?.unitType ?? 'unit',
        sale: prev[id]?.sale ?? '',
        ...patch,
      },
    }))
  }

  const newQtyParsed = parseQtyInput(newInitialQty)
  const newCostParsed = parsePriceInput(newCost)
  const newFormTotal = useMemo(() => {
    if (newQtyParsed <= 0 || newCostParsed == null) return null
    return calculateTotal(newQtyParsed, newCostParsed)
  }, [newQtyParsed, newCostParsed])

  const monthlySummary = useMemo(
    () => aggregateStockByMonth(stockMovements ?? []),
    [stockMovements],
  )

  const yearOptions = useMemo(() => {
    const set = new Set<string>()
    const yNow = new Date().getFullYear()
    for (let y = yNow; y >= yNow - 12; y--) set.add(String(y))
    for (const r of monthlySummary) {
      set.add(r.month.slice(0, 4))
    }
    return Array.from(set).sort((a, b) => b.localeCompare(a))
  }, [monthlySummary])

  const displayedMonthlySummary = useMemo(() => {
    let rows = monthlySummary
    const y = filterYear.trim()
    if (y) {
      rows = rows.filter((r) => r.month.startsWith(`${y}-`))
    }
    const mp = filterMonthPart.trim()
    if (mp && y) {
      rows = rows.filter((r) => r.month === `${y}-${mp}`)
    }
    return rows
  }, [monthlySummary, filterYear, filterMonthPart])

  const hasStockFilters = Boolean(filterYear.trim() || filterMonthPart.trim())

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.name.toLowerCase().includes(q))
  }, [products, searchQuery])

  const handleAddProduct = async () => {
    const name = newName.trim()
    if (!name) return
    const min = Math.max(0, parseInt(newMin, 10) || 0)
    const qty = newQtyParsed
    const cost = parsePriceInput(newCost)
    const sale = parsePriceInput(newSale)
    if (qty > 0 && cost == null) {
      return
    }
    setBusy('new')
    try {
      const ok = await onAddProduct(name, min, newUnitType, qty, cost, sale)
      if (ok) {
        setNewName('')
        setNewMin('1')
        setNewUnitType('unit')
        setNewInitialQty('0')
        setNewCost('')
        setNewSale('')
      }
    } finally {
      setBusy(null)
    }
  }

  const handleSaveCost = async (p: ProductRow) => {
    const d = costDraft[p.id]
    if (!d) return
    const cost = parsePriceInput(d.cost)
    const sale = parsePriceInput(d.sale)
    if (d.cost.trim() !== '' && cost === null) {
      return
    }
    if (d.sale.trim() !== '' && sale === null) {
      return
    }
    setBusy(`cost-${p.id}`)
    try {
      await onUpdateProductCost(p.id, d.unitType, cost, sale, p.stock)
    } finally {
      setBusy(null)
    }
  }

  const handleDelete = async (p: ProductRow) => {
    const ok = window.confirm(
      `Eliminar o produto «${p.name}» e todo o histórico de movimentos de stock associado?`
    )
    if (!ok) return
    setBusy(`del-${p.id}`)
    try {
      await onDeleteProduct(p.id, p.name)
    } finally {
      setBusy(null)
    }
  }

  const displayCost = (p: ProductRow) => {
    const c = p.cost_per_unit ?? p.unit_price
    return c != null && !Number.isNaN(Number(c)) ? Number(c) : null
  }

  return (
    <Card className="admin-card overflow-hidden !shadow-none">
      <CardContent className="space-y-8 p-6 md:p-7">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--text-main)]">
            Stock
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-main)]/75">
            Unidade (unidade / pack / litros), quantidade em stock, custo por unidade e
            valor total do inventário. Na entrada de stock indica o preço por unidade
            para atualizar o custo médio. Opcional: preço de venda — nas saídas, o
            fluxo de caixa regista receita em vez de despesa de utilização.
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/60 p-5">
          <h3 className="text-sm font-semibold tracking-wide text-[var(--text-main)]">
            Resumo mensal (stock)
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-main)]/65">
            Valores em € com base nos movimentos registados:{' '}
            <span className="font-medium text-[#6b9b7a]">entradas</span> (compras /
            reposição) e{' '}
            <span className="font-medium text-[#c48080]">saídas</span> (uso ou venda
            ao cliente). Período carregado: últimos 24 meses. Escolhe o{' '}
            <span className="font-medium">ano</span> para ver só esse ano; opcionalmente
            o <span className="font-medium">mês</span> para um único mês.
          </p>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <div className="min-w-[9rem]">
              <label
                htmlFor="stock-filter-year"
                className="mb-1 block text-xs font-medium text-[var(--text-main)]"
              >
                Ano
              </label>
              <select
                id="stock-filter-year"
                value={filterYear}
                onChange={(e) => {
                  setFilterYear(e.target.value)
                  setFilterMonthPart('')
                }}
                className="admin-field w-full px-3 py-2 text-sm"
              >
                <option value="">Todos os anos</option>
                {yearOptions.map((yy) => (
                  <option key={yy} value={yy}>
                    {yy}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-[11rem]">
              <label
                htmlFor="stock-filter-month"
                className="mb-1 block text-xs font-medium text-[var(--text-main)]"
              >
                Mês
              </label>
              <select
                id="stock-filter-month"
                value={filterMonthPart}
                disabled={!filterYear}
                onChange={(e) => setFilterMonthPart(e.target.value)}
                className="admin-field w-full px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {STOCK_MONTH_FILTER_OPTIONS.map((o) => (
                  <option key={o.value || 'all'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasStockFilters}
              onClick={() => {
                setFilterYear('')
                setFilterMonthPart('')
              }}
              className="rounded-xl border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none hover:bg-[var(--highlight)]"
            >
              Limpar filtros
            </Button>
          </div>
          {monthlySummary.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--text-main)]/60">
              Sem movimentos neste período.
            </p>
          ) : displayedMonthlySummary.length === 0 ? (
            <p className="mt-3 text-sm text-[var(--text-main)]/60">
              Sem movimentos no período filtrado.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-main)]/25">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--bg-soft)]/80 text-xs uppercase tracking-wide text-[var(--text-main)]/65">
                  <tr>
                    <th className="px-4 py-3 font-medium">Mês</th>
                    <th className="px-4 py-3 font-medium text-[#6b9b7a]">
                      Entradas
                    </th>
                    <th className="px-4 py-3 font-medium text-[#c48080]">
                      Saídas
                    </th>
                    <th className="px-4 py-3 font-medium text-[var(--gold)]">
                      Saldo mês
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {displayedMonthlySummary.map((row) => (
                    <tr key={row.month} className="bg-transparent">
                      <td className="px-4 py-2.5 capitalize text-[var(--text-main)]">
                        {row.label}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-[#6b9b7a]">
                        {formatEUR(row.inSum)}
                      </td>
                      <td className="px-4 py-2.5 tabular-nums text-[#c48080]">
                        {formatEUR(row.outSum)}
                      </td>
                      <td className="px-4 py-2.5 font-medium tabular-nums text-[var(--gold)]">
                        {formatEUR(row.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-main)]/40"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar produto pelo nome…"
            autoComplete="off"
            className="admin-field w-full rounded-2xl py-3 pl-10 pr-4 text-sm"
            aria-label="Pesquisar produtos"
          />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)]/80 p-5 transition-colors duration-300 md:flex-row md:flex-wrap md:items-end">
          <div className="min-w-[120px] flex-1">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Nome
            </label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome"
              className="admin-field w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div className="min-w-[120px]">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Tipo de unidade
            </label>
            <select
              value={newUnitType}
              onChange={(e) => setNewUnitType(e.target.value)}
              className="admin-field w-full px-3 py-2.5 text-sm"
            >
              {STOCK_UNIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24 min-w-[5rem]">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Quantidade
            </label>
            <input
              type="number"
              min={0}
              value={newInitialQty}
              onChange={(e) => setNewInitialQty(e.target.value)}
              className="admin-field w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div className="w-28 min-w-[6.5rem]">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Custo / un.
            </label>
            <input
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
              placeholder="0,00"
              inputMode="decimal"
              min={0}
              className="admin-field w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div className="w-28 min-w-[6.5rem]">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Venda / un.
            </label>
            <input
              value={newSale}
              onChange={(e) => setNewSale(e.target.value)}
              placeholder="opcional"
              inputMode="decimal"
              min={0}
              className="admin-field w-full px-3 py-2.5 text-sm"
            />
          </div>
          <div className="w-full min-w-[8rem] md:w-auto md:pb-2">
            {newFormTotal != null ? (
              <p className="text-sm font-semibold tabular-nums text-[var(--gold)]">
                Total: {formatEUR(newFormTotal)}
              </p>
            ) : (
              <p className="text-xs text-[var(--text-main)]/55">
                Total: — (quantidade e preço ≥ 0)
              </p>
            )}
          </div>
          <div className="w-24 min-w-[5rem]">
            <label className="mb-1.5 block text-xs font-medium text-[var(--text-main)]">
              Mín. itens
            </label>
            <input
              type="number"
              min={0}
              value={newMin}
              onChange={(e) => setNewMin(e.target.value)}
              className="admin-field w-full px-3 py-2.5 text-sm"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddProduct}
            disabled={
              busy === 'new' ||
              !newName.trim() ||
              (newQtyParsed > 0 && newCostParsed == null)
            }
            className="rounded-xl border border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)] md:shrink-0"
          >
            Adicionar
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-[var(--text-main)]/65">A carregar produtos…</p>
        ) : products.length === 0 ? (
          <p className="text-sm text-[var(--text-main)]/65">Ainda não há produtos.</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-sm text-[var(--text-main)]/65">
            Nenhum produto corresponde à pesquisa.
          </p>
        ) : (
          <ul className="space-y-4">
            {filteredProducts.map((p) => {
              const low = p.stock <= p.min_stock
              const pid = p.id
              const q = getQty(pid)
              const afterIn = p.stock + q
              const afterOut = Math.max(0, p.stock - q)
              const draft = costDraft[pid] ?? {
                cost: '',
                unitType: 'unit',
                sale: '',
              }
              const movUnit = getMovUnitPrice(pid)
              const movTotal =
                movUnit != null ? calculateTotal(q, movUnit) : null
              const costShown = displayCost(p)
              const tv = Number(p.total_value ?? 0)

              return (
                <li
                  key={pid}
                  className={`rounded-2xl border px-5 py-4 transition-colors duration-300 ${
                    low
                      ? 'border-[var(--border)] bg-[var(--highlight)]'
                      : 'border-[var(--border)] bg-[var(--bg-main)]/40'
                  }`}
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium text-[var(--text-main)]">{p.name}</p>
                      <p className="text-sm text-[var(--text-main)]/80">
                        <span className="text-[var(--text-main)]/70">Unidade:</span>{' '}
                        {stockUnitLabel(p.unit_type)}
                        {' · '}
                        <span className="text-[var(--text-main)]/70">Itens em stock:</span>{' '}
                        <span className="font-semibold tabular-nums text-[var(--gold)]">
                          {p.stock}
                        </span>
                        {' · '}
                        <span className="text-[var(--text-main)]/70">Alerta se ≤</span>{' '}
                        <span className="tabular-nums">{p.min_stock}</span>
                        {low && (
                          <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-main)]">
                            Stock baixo
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-[var(--text-main)]/75">
                        Custo / un.:{' '}
                        {costShown != null ? (
                          <span className="font-medium tabular-nums text-[var(--gold)]">
                            {formatEUR(costShown)}
                          </span>
                        ) : (
                          <span className="italic">—</span>
                        )}
                        {p.sale_price != null &&
                          !Number.isNaN(Number(p.sale_price)) && (
                            <>
                              {' · '}
                              <span className="text-[var(--text-main)]/70">
                                Venda / un.:
                              </span>{' '}
                              <span className="font-medium tabular-nums text-[#6b9b7a]">
                                {formatEUR(Number(p.sale_price))}
                              </span>
                            </>
                          )}
                        {' · '}
                        <span className="text-[var(--text-main)]/70">Valor total:</span>{' '}
                        <span className="text-base font-semibold tabular-nums text-[var(--gold)]">
                          {formatEUR(tv)}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-end gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={qtyByProduct[pid] ?? '1'}
                            onChange={(e) => setQty(pid, e.target.value)}
                            className="admin-field w-20 px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">
                            Preço / un. (entrada)
                          </label>
                          <input
                            value={movPriceByProduct[pid] ?? ''}
                            onChange={(e) => setMovPrice(pid, e.target.value)}
                            placeholder="0,00"
                            inputMode="decimal"
                            min={0}
                            className="admin-field w-28 px-2 py-1.5 text-sm"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={
                              busy === `${pid}-in` ||
                              movUnit == null ||
                              movUnit < 0
                            }
                            onClick={async () => {
                              const up = getMovUnitPrice(pid)
                              if (up == null) return
                              setBusy(`${pid}-in`)
                              try {
                                await onStockIn(pid, getQty(pid), up)
                              } finally {
                                setBusy(null)
                              }
                            }}
                            className="rounded-lg border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)]"
                          >
                            Entrada
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={busy === `${pid}-out`}
                            onClick={async () => {
                              setBusy(`${pid}-out`)
                              try {
                                await onStockOut(pid, getQty(pid))
                              } finally {
                                setBusy(null)
                              }
                            }}
                            className="rounded-lg border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)]"
                          >
                            Saída
                          </Button>
                        </div>
                      </div>
                      {movTotal != null ? (
                        <p className="text-sm font-semibold tabular-nums text-[var(--gold)]">
                          Total (entrada): {formatEUR(movTotal)}
                        </p>
                      ) : (
                        <p className="text-xs text-[var(--text-main)]/55">
                          Total (entrada): — (preço por unidade ≥ 0)
                        </p>
                      )}
                      {p.stock > 0 &&
                        costShown != null &&
                        Number.isFinite(tv / p.stock) && (
                          <p className="text-xs text-[var(--text-main)]/60">
                            Custo médio atual (saída):{' '}
                            {formatEUR(tv / p.stock)} / un.
                          </p>
                        )}
                      <p className="text-xs leading-relaxed text-[var(--text-main)]/60">
                        Com esta quantidade: após entrada ficam{' '}
                        <span className="font-medium tabular-nums text-[var(--text-main)]/80">
                          {afterIn}
                        </span>{' '}
                        itens · após saída ficam{' '}
                        <span className="font-medium tabular-nums text-[var(--text-main)]/80">
                          {afterOut}
                        </span>{' '}
                        itens
                        {p.stock < q && (
                          <span className="block text-[#a85c5c]/90">
                            Não podes retirar mais do que tens em stock.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="min-w-[120px]">
                      <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">
                        Tipo de unidade
                      </label>
                      <select
                        value={draft.unitType}
                        onChange={(e) => setDraft(pid, { unitType: e.target.value })}
                        className="admin-field w-full px-3 py-2 text-sm"
                      >
                        {STOCK_UNIT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full min-w-[5rem] sm:w-32">
                      <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">
                        Custo / un. (€)
                      </label>
                      <input
                        value={draft.cost}
                        onChange={(e) => setDraft(pid, { cost: e.target.value })}
                        placeholder="opcional"
                        inputMode="decimal"
                        min={0}
                        className="admin-field w-full px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="w-full min-w-[5rem] sm:w-32">
                      <label className="mb-1 block text-xs font-medium text-[var(--text-main)]">
                        Venda / un. (€)
                      </label>
                      <input
                        value={draft.sale}
                        onChange={(e) => setDraft(pid, { sale: e.target.value })}
                        placeholder="opcional"
                        inputMode="decimal"
                        min={0}
                        className="admin-field w-full px-3 py-2 text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy === `cost-${pid}`}
                      onClick={() => handleSaveCost(p)}
                      className="rounded-lg border-[var(--border)] bg-[var(--gold)]/25 text-[var(--text-main)] shadow-none hover:bg-[var(--gold)]/40"
                    >
                      {busy === `cost-${pid}` ? 'A guardar…' : 'Guardar custo'}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy === `del-${pid}`}
                      onClick={() => handleDelete(p)}
                      className="rounded-lg border border-[var(--border)] bg-transparent text-[#a85c5c] shadow-none hover:bg-[var(--highlight)] sm:ml-auto"
                    >
                      {busy === `del-${pid}` ? 'A eliminar…' : 'Excluir produto'}
                    </Button>
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
