export const STOCK_UNIT_OPTIONS: { value: string; label: string }[] = [
  { value: 'unit', label: 'Unidade' },
  { value: 'pack', label: 'Pack' },
  { value: 'liters', label: 'Litros' },
]

export function normalizeStockUnitType(raw: string): string {
  const x = (raw || 'unit').trim().toLowerCase()
  if (['liters', 'liter', 'litro', 'litros'].includes(x)) return 'liters'
  if (x === 'pack') return 'pack'
  return 'unit'
}

export function stockUnitLabel(unitType: string): string {
  const u = normalizeStockUnitType(unitType)
  return STOCK_UNIT_OPTIONS.find((o) => o.value === u)?.label ?? unitType
}
