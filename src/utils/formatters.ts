// Função auxiliar para formatar a data para exibição
export function formatarData(data: Date): string {
  const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
  const diaDaSemana = diasDaSemana[data.getDay()]
  
  return `${diaDaSemana}, ${data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })}`
}

// Função para formatar a data para o banco de dados (formato ISO)
export function formatarDataBanco(data: Date): string {
  return data.toISOString().split('T')[0];
}

// Função para formatar moeda
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
}

// Função para formatar telefone
export function formatarTelefone(telefone: string): string {
  // Remove todos os caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  // Formato internacional: +XX XXX XXXXXXX
  if (numeros.length >= 10) {
    return `+${numeros.slice(0, 2)} ${numeros.slice(2, 5)} ${numeros.slice(5)}`;
  }
  
  return telefone;
} 