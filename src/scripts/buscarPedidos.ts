import { getUltimosPedidos } from '../utils/getPedidos';

async function mostrarUltimosPedidos() {
  try {
    const pedidos = await getUltimosPedidos();
    console.log('Últimos 7 pedidos:');
    pedidos.forEach(pedido => {
      console.log(`
ID: ${pedido.id}
Valor: R$ ${pedido.valor}
Status: ${pedido.status}
Data de Pagamento: ${pedido.data_pagamento || 'Pendente'}
Data de Criação: ${new Date(pedido.created_at).toLocaleDateString('pt-BR')}
-------------------`);
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
  }
}

mostrarUltimosPedidos(); 