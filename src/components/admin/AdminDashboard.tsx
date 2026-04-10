'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/config/supabase-client'
import { calculateTotal } from '@/lib/admin/stockCost'
import { formatSupabaseError } from '@/lib/admin/supabaseErrors'
import type { Database } from '@/types/database.types'
import { toast } from 'sonner'
import { AdminHistorySection } from './dashboard/AdminHistorySection'
import { AdminStockCard } from './dashboard/AdminStockCard'

type ProductRow = Database['public']['Tables']['products']['Row']
type FinancialLogRow = Database['public']['Tables']['financial_logs']['Row']
type StockMovementRow = Database['public']['Tables']['stock_movements']['Row']

type MovementWithProduct = StockMovementRow & {
  products?: { name: string } | null
}

export function AdminDashboard() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [sessionReady, setSessionReady] = useState(false)
  const [financialLogs, setFinancialLogs] = useState<FinancialLogRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [stockMovements, setStockMovements] = useState<MovementWithProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingMovementId, setDeletingMovementId] = useState<string | null>(null)

  const refreshData = useCallback(async () => {
    setLoading(true)
    try {
      const [logsRes, productsRes, movRes] = await Promise.all([
        supabase
          .from('financial_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase.from('products').select('*').order('name'),
        supabase
          .from('stock_movements')
          .select('*, products(name)')
          .order('created_at', { ascending: false })
          .limit(80),
      ])

      const problems: string[] = []
      if (logsRes.error) {
        problems.push(`Finanças: ${formatSupabaseError(logsRes.error)}`)
      }
      if (productsRes.error) {
        problems.push(`Produtos: ${formatSupabaseError(productsRes.error)}`)
      }
      if (movRes.error) {
        problems.push(`Movimentos: ${formatSupabaseError(movRes.error)}`)
      }

      setFinancialLogs((logsRes.data as FinancialLogRow[]) ?? [])
      setProducts((productsRes.data as ProductRow[]) ?? [])
      setStockMovements((movRes.data as MovementWithProduct[]) ?? [])

      if (problems.length > 0) {
        console.warn('[admin refresh]', problems.join(' | '))
        toast.error(problems.join(' · '))
      }
    } catch (e) {
      const msg = formatSupabaseError(e)
      console.error('[admin refresh]', msg, e)
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

  const handleAddProduct = async (
    name: string,
    minStock: number,
    unitType: string,
    initialQty: number,
    costPerUnit: number | null,
    salePrice: number | null
  ): Promise<boolean> => {
    const qty = Math.max(0, Math.floor(initialQty))
    if (qty > 0 && (costPerUnit == null || costPerUnit < 0)) {
      toast.error('Com quantidade inicial > 0, indica o preço por unidade (≥ 0).')
      return false
    }
    const totalVal =
      qty > 0 && costPerUnit != null ? calculateTotal(qty, costPerUnit) : 0
    const { error } = await supabase.from('products').insert({
      name,
      min_stock: minStock,
      stock: qty,
      unit_type: unitType,
      unit_price: costPerUnit,
      cost_per_unit: costPerUnit,
      total_value: totalVal,
      sale_price: salePrice,
    })
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success('Produto criado.')
    await refreshData()
    return true
  }

  const handleUpdateProductCost = async (
    productId: string,
    unitType: string,
    costPerUnit: number | null,
    salePrice: number | null,
    currentStock: number
  ) => {
    const stock = Math.max(0, Math.floor(currentStock))
    const payload: {
      unit_type: string
      unit_price: number | null
      cost_per_unit: number | null
      sale_price: number | null
      total_value?: number
    } = {
      unit_type: unitType,
      unit_price: costPerUnit,
      cost_per_unit: costPerUnit,
      sale_price: salePrice,
    }
    if (stock === 0) {
      payload.total_value = 0
    } else if (costPerUnit != null) {
      payload.total_value = calculateTotal(stock, costPerUnit)
    }
    const { error } = await supabase.from('products').update(payload).eq('id', productId)
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success('Custo e unidade guardados.')
    await refreshData()
  }

  const handleDeleteProduct = async (productId: string, productName: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      toast.error(error.message)
      throw error
    }
    toast.success(`Produto «${productName}» eliminado.`)
    await refreshData()
  }

  const handleStockIn = async (
    productId: string,
    quantity: number,
    unitPrice: number
  ) => {
    const qty = Math.max(0, Math.floor(quantity))
    if (qty <= 0) {
      toast.error('Quantidade inválida.')
      return
    }
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      toast.error('Indica o preço por unidade (≥ 0).')
      return
    }
    const { data: p, error: fetchErr } = await supabase
      .from('products')
      .select('stock, total_value, unit_type')
      .eq('id', productId)
      .single()
    if (fetchErr || !p) {
      toast.error(fetchErr?.message ?? 'Produto não encontrado.')
      return
    }
    const stock = p.stock
    const tv = Number(p.total_value ?? 0)
    const totalPrice = calculateTotal(qty, unitPrice)
    const nextStock = stock + qty
    const nextTv = tv + totalPrice
    const nextCost =
      nextStock > 0 ? Math.round((nextTv / nextStock) * 100) / 100 : null
    const { error: upErr } = await supabase
      .from('products')
      .update({
        stock: nextStock,
        total_value: nextTv,
        cost_per_unit: nextCost,
        unit_price: nextCost,
      })
      .eq('id', productId)
    if (upErr) {
      toast.error(upErr.message)
      return
    }
    const { error: movErr } = await supabase.from('stock_movements').insert({
      product_id: productId,
      type: 'in',
      quantity: qty,
      unit_type: p.unit_type,
      unit_price: unitPrice,
      total_price: totalPrice,
    })
    if (movErr) {
      await supabase
        .from('products')
        .update({
          stock,
          total_value: tv,
          cost_per_unit:
            stock > 0 ? Math.round((tv / stock) * 100) / 100 : null,
          unit_price:
            stock > 0 ? Math.round((tv / stock) * 100) / 100 : null,
        })
        .eq('id', productId)
      toast.error(movErr.message)
      return
    }
    toast.success('Stock atualizado (entrada).')
    await refreshData()
  }

  const handleStockOut = async (productId: string, quantity: number) => {
    const qty = Math.max(0, Math.floor(quantity))
    if (qty <= 0) {
      toast.error('Quantidade inválida.')
      return
    }
    const { data: p, error: fetchErr } = await supabase
      .from('products')
      .select('stock, total_value, unit_type')
      .eq('id', productId)
      .single()
    if (fetchErr || !p) {
      toast.error(fetchErr?.message ?? 'Produto não encontrado.')
      return
    }
    if (p.stock < qty) {
      toast.error('Stock insuficiente.')
      return
    }
    const stock = p.stock
    const tv = Number(p.total_value ?? 0)
    const avgUnit = stock > 0 ? tv / stock : 0
    const valueOut = calculateTotal(qty, avgUnit)
    const nextStock = stock - qty
    const nextTv = Math.max(0, tv - valueOut)
    const avgRounded = Math.round(avgUnit * 100) / 100
    const nextCost =
      nextStock > 0 ? Math.round((nextTv / nextStock) * 100) / 100 : null
    const { error: upErr } = await supabase
      .from('products')
      .update({
        stock: nextStock,
        total_value: nextTv,
        cost_per_unit: nextCost,
        unit_price: nextCost,
      })
      .eq('id', productId)
    if (upErr) {
      toast.error(upErr.message)
      return
    }
    const { error: movErr } = await supabase.from('stock_movements').insert({
      product_id: productId,
      type: 'out',
      quantity: qty,
      unit_type: p.unit_type,
      unit_price: avgRounded,
      total_price: valueOut,
    })
    if (movErr) {
      await supabase
        .from('products')
        .update({
          stock,
          total_value: tv,
          cost_per_unit:
            stock > 0 ? Math.round((tv / stock) * 100) / 100 : null,
          unit_price:
            stock > 0 ? Math.round((tv / stock) * 100) / 100 : null,
        })
        .eq('id', productId)
      toast.error(movErr.message)
      return
    }
    toast.success('Stock atualizado (saída).')
    await refreshData()
  }

  const handleDeleteStockMovement = async (row: MovementWithProduct) => {
    const ok = window.confirm(
      'Remover este movimento do histórico e ajustar o stock do produto (reverter entrada/saída)?'
    )
    if (!ok) return

    setDeletingMovementId(row.id)
    try {
      const { error: delErr } = await supabase
        .from('stock_movements')
        .delete()
        .eq('id', row.id)
      if (delErr) throw delErr

      const { data: p, error: fetchErr } = await supabase
        .from('products')
        .select('stock, total_value')
        .eq('id', row.product_id)
        .single()

      if (fetchErr || !p) {
        toast.warning(
          'Movimento removido. Não foi possível ler o produto — verifica o stock manualmente.'
        )
        await refreshData()
        return
      }

      const tp =
        row.total_price != null && Number.isFinite(Number(row.total_price))
          ? Number(row.total_price)
          : null

      const delta = row.type === 'in' ? -row.quantity : row.quantity
      const nextStock = Math.max(0, p.stock + delta)
      let nextTv = Number(p.total_value ?? 0)
      if (tp != null) {
        if (row.type === 'in') {
          nextTv = Math.max(0, nextTv - tp)
        } else {
          nextTv = nextTv + tp
        }
      }
      const nextCost =
        nextStock > 0 ? Math.round((nextTv / nextStock) * 100) / 100 : null

      const { error: upErr } = await supabase
        .from('products')
        .update({
          stock: nextStock,
          total_value: nextTv,
          cost_per_unit: nextCost,
          unit_price: nextCost,
        })
        .eq('id', row.product_id)
      if (upErr) throw upErr

      toast.success('Movimento removido e stock corrigido.')
      await refreshData()
    } catch (e) {
      toast.error(formatSupabaseError(e))
    } finally {
      setDeletingMovementId(null)
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
            Stock e histórico
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-main)]/70">
            Produtos, movimentos e registos guardados. Saldo e distribuição estão na{' '}
            <Link
              href="/admin/financas"
              className="font-medium text-[var(--gold)] underline decoration-[var(--border)] underline-offset-2 transition-colors hover:decoration-[var(--gold)]"
            >
              página Finanças
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-xl border-[var(--border)] bg-transparent text-[var(--text-main)] shadow-none transition-all duration-300 hover:bg-[var(--highlight)]"
          >
            <Link href="/admin/financas">Finanças</Link>
          </Button>
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

      <AdminStockCard
        products={products}
        loading={loading}
        onAddProduct={handleAddProduct}
        onUpdateProductCost={handleUpdateProductCost}
        onDeleteProduct={handleDeleteProduct}
        onStockIn={handleStockIn}
        onStockOut={handleStockOut}
      />

      <AdminHistorySection
        financialLogs={financialLogs}
        stockMovements={stockMovements}
        loading={loading}
        onDeleteStockMovement={handleDeleteStockMovement}
        deletingMovementId={deletingMovementId}
      />
    </div>
  )
}
