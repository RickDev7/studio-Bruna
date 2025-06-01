'use client'

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/config/supabase";

// Definição dos tipos
type PedidoStatus = "pendente" | "pago";

interface Pedido {
  id: string;
  nome: string;
  email: string;
  valor: string;
  status: PedidoStatus;
  created_at: string;
}

export default function PagamentosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<"todos" | PedidoStatus>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarPedidos = useCallback(async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("status", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setPedidos(data as Pedido[]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar pedidos';
      console.error('Erro ao carregar pedidos:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  const enviarEmails = async (pedido: Pedido) => {
    try {
      // Email para o cliente
      await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: pedido.nome,
          userEmail: pedido.email,
          orderId: pedido.id,
          totalPrice: pedido.valor,
          isPaymentConfirmation: true
        }),
      });
    } catch (error) {
      console.error('Erro ao enviar emails:', error);
      throw new Error('Erro ao enviar emails de confirmação');
    }
  };

  const confirmarPagamento = async (pedido: Pedido) => {
    try {
      setLoading(true);
      setError(null);

      // Atualizar status no banco
      const { error: updateError } = await supabase
        .from("pedidos")
        .update({ status: "pago" })
        .eq("id", pedido.id);

      if (updateError) throw updateError;

      // Enviar emails de confirmação
      await enviarEmails(pedido);

      // Atualizar lista de pedidos
      setPedidos(pedidos.map(p => 
        p.id === pedido.id ? { ...p, status: "pago" } : p
      ));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao confirmar pagamento';
      console.error('Erro ao confirmar pagamento:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos.filter(pedido => 
    filtro === "todos" ? true : pedido.status === filtro
  );

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pagamentos</h1>
        <div className="space-x-2">
          <Button
            onClick={() => setFiltro("todos")}
            className={filtro === "todos" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFiltro("pendente")}
            className={filtro === "pendente" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}
          >
            Pendentes
          </Button>
          <Button
            onClick={() => setFiltro("pago")}
            className={filtro === "pago" ? "bg-pink-500 text-white" : "bg-white text-gray-700"}
          >
            Pagos
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {pedidosFiltrados.map((pedido) => (
          <Card key={pedido.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{pedido.nome}</h3>
                  <p className="text-sm text-gray-500">{pedido.email}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="font-medium text-lg mt-2">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(parseFloat(pedido.valor))}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      pedido.status === "pago"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pedido.status === "pago" ? "Pago" : "Pendente"}
                  </span>
                  {pedido.status === "pendente" && (
                    <Button
                      onClick={() => confirmarPagamento(pedido)}
                      disabled={loading}
                    >
                      Confirmar Pagamento
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {pedidosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum pagamento encontrado
          </div>
        )}
      </div>
    </div>
  );
} 