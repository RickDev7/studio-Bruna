import { roundMoney } from '@/lib/admin/finance'

export function computeServiceLogAmounts(
  unitPrice: number,
  unitEstimatedCost: number,
  quantity: number
): {
  total_revenue: number
  total_cost: number
  profit: number
  quantity: number
} {
  const q = Math.max(1, Math.floor(quantity))
  const rev = roundMoney(unitPrice * q)
  const cost = roundMoney(unitEstimatedCost * q)
  return {
    quantity: q,
    total_revenue: rev,
    total_cost: cost,
    profit: roundMoney(rev - cost),
  }
}
