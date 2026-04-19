export const REVENUE_PAYMENT_OPTIONS = [
  ['fresha', 'Fresha'],
  ['paypal', 'PayPal'],
  ['numerario', 'Numerário'],
  ['transferencia_bancaria', 'Transferência bancária'],
] as const

export type RevenuePaymentMethod = (typeof REVENUE_PAYMENT_OPTIONS)[number][0]

/** Rótulo para UI (entrada de receitas, relatórios, etc.). */
export function paymentMethodLabel(code: string | null | undefined): string {
  if (!code?.trim()) return '—'
  const c = code.trim().toLowerCase()
  const opt = REVENUE_PAYMENT_OPTIONS.find(([val]) => val === c)
  if (opt) return opt[1]
  const legacy: Record<string, string> = {
    cash: 'Numerário',
    card: 'Cartão',
    mixed: 'Misto',
  }
  return legacy[c] ?? code
}
