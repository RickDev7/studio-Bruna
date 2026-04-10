/** Custo total = quantidade × preço unitário (EUR, 2 casas). */
export function calculateTotal(quantity: number, unitPrice: number): number {
  const q = Number(quantity)
  const u = Number(unitPrice)
  if (!Number.isFinite(q) || !Number.isFinite(u)) return 0
  return Math.round(q * u * 100) / 100
}
