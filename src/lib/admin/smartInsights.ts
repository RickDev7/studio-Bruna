export type SmartInsight = {
  id: string
  message: string
  variant: 'positive' | 'caution' | 'growth'
}

const FORECAST_LOW_EUR = 200
const FORECAST_INVEST_EUR = 500

export function computeSmartInsights(input: {
  monthlyFinalProfit: number
  forecastBalance: number
  profitGrowingTwoPlusMonths: boolean
}): SmartInsight[] {
  const list: SmartInsight[] = []
  const { monthlyFinalProfit, forecastBalance, profitGrowingTwoPlusMonths } =
    input

  if (forecastBalance < FORECAST_LOW_EUR) {
    list.push({
      id: 'reserve',
      variant: 'caution',
      message:
        'Evite investir por agora: mantenha reserva de caixa — o saldo previsto está abaixo de 200 €.',
    })
  }

  if (monthlyFinalProfit > 0 && forecastBalance > FORECAST_INVEST_EUR) {
    list.push({
      id: 'invest-range',
      variant: 'positive',
      message:
        'Pode investir com margem: considere alocar cerca de 20–30% do saldo disponível (após obrigações), dado lucro mensal positivo e previsão acima de 500 €.',
    })
  }

  if (profitGrowingTwoPlusMonths) {
    list.push({
      id: 'reinvest',
      variant: 'growth',
      message:
        'O lucro mensal consolidado subiu nos últimos meses: avalie reinvestir no negócio (equipamento, marketing, formação).',
    })
  }

  return list
}
