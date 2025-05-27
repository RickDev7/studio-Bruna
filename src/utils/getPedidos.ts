import { supabase } from '../config/supabase';

export async function getUltimosPedidos(limite: number = 7) {
  const { data, error } = await supabase
    .from('pedidos')
    .select('id, valor, status, data_pagamento, created_at')
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    throw error;
  }

  return data;
} 