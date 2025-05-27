import { PlanoDetails } from './PlanoDetails'

interface PlanoDetalhes {
  id: string
  nome: string
  descricao: string
  preco: string
  servicos: string[]
  beneficios: string[]
  imagem: string
}

const planos: { [key: string]: PlanoDetalhes } = {
  'basico': {
    id: 'basico',
    nome: 'Plano Básico',
    descricao: 'Cuidados básicos mensais para manter suas mãos e pés sempre bem cuidados.',
    preco: '40€/mês',
    servicos: [
      '1 Manicure com Shellac',
      '1 Pedicure simples',
      '10% de desconto em serviços adicionais'
    ],
    beneficios: [
      'Ideal para clientes que desejam manter mãos e pés bem cuidados com um tratamento mensal básico'
    ],
    imagem: '/images/plano-basico.jpg'
  },
  'balance': {
    id: 'balance',
    nome: 'Plano Balance',
    descricao: 'Autocuidado completo para você manter-se sempre impecável.',
    preco: '65€/mês',
    servicos: [
      '1 Tratamento de unhas em gel',
      '1 Pedicure com Shellac',
      '1 Design de sobrancelhas',
      'Até 2 reparos de unhas',
      '10% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    beneficios: [
      'Prioridade no agendamento',
      'Perfeito para quem deseja manter unhas e sobrancelhas sempre impecáveis'
    ],
    imagem: '/images/plano-balance.jpg'
  },
  'premium': {
    id: 'premium',
    nome: 'Plano Premium',
    descricao: 'Experiência VIP completa com máximo conforto e exclusividade.',
    preco: '115€/mês',
    servicos: [
      '1 Spa pedicure com Shellac',
      '1 Tratamento de unhas em gel',
      '1 Limpeza facial',
      '1 Design de sobrancelhas',
      'Reparos ilimitados de unhas',
      '15% de desconto em serviços adicionais',
      'Prioridade no agendamento'
    ],
    beneficios: [
      'Prioridade no agendamento',
      'Para mulheres que desejam se presentear com o luxo do cuidado e uma experiência completa e relaxante — dos pés ao rosto, com mimo e exclusividade'
    ],
    imagem: '/images/plano-premium.jpg'
  }
}

export default function PlanoPage({ params }: { params: { id: string } }) {
  const plano = planos[params.id]

  if (!plano) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Plano não encontrado</p>
      </div>
    )
  }

  return <PlanoDetails plano={plano} />
} 