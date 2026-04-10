'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Database } from '@/types/database.types'
import { calculateTotal } from '@/lib/admin/stockCost'
import {
  STOCK_UNIT_OPTIONS,
  normalizeStockUnitType,
  stockUnitLabel,
} from '@/lib/admin/stockUnits'
import { formatEUR } from './format'

type ProductRow = Database['public']['Tables']['products']['Row']

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
  loading,
  onAddProduct,
  onUpdateProductCost,
  onDeleteProduct,
  onStockIn,
  onStockOut,
}: Props) {
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
        ) : (
          <ul className="space-y-4">
            {products.map((p) => {
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
