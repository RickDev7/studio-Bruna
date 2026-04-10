/** Valores fixos do modelo financeiro (€) */
export const BASE_SECURITY_EUR = 450
export const STOCK_RESERVE_EUR = 150

/** 1 mês de despesas fixas = base + reserva de stock */
export const ONE_MONTH_FIXED_EXPENSES_EUR = BASE_SECURITY_EUR + STOCK_RESERVE_EUR

export type DistributionMode = 'standard' | 'redistributed' | 'negative_net'

export type DistributionResult = {
  salary: number
  investment: number
  emergency: number
  mode: DistributionMode
}

export function computeNetBalance(totalBalance: number): number {
  return totalBalance - BASE_SECURITY_EUR - STOCK_RESERVE_EUR
}

/**
 * Soma histórica de emergência (logs anteriores).
 * Quando >= 1 mês de despesas fixas, redistribui 60% / 40% / 0%.
 */
export function computeDistribution(
  netBalance: number,
  accumulatedEmergencyFromLogs: number
): DistributionResult {
  if (netBalance < 0) {
    return { salary: 0, investment: 0, emergency: 0, mode: 'negative_net' }
  }

  if (accumulatedEmergencyFromLogs >= ONE_MONTH_FIXED_EXPENSES_EUR) {
    return {
      salary: netBalance * 0.6,
      investment: netBalance * 0.4,
      emergency: 0,
      mode: 'redistributed',
    }
  }

  return {
    salary: netBalance * 0.5,
    investment: netBalance * 0.25,
    emergency: netBalance * 0.25,
    mode: 'standard',
  }
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100
}
