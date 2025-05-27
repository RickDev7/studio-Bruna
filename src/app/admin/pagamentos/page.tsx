'use client'

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/config/supabase";
import { emailjsConfig } from "@/config/emailjs";

// Definição dos tipos
type PedidoStatus = "pendente" | "pago";

interface Pedido {
  id: string;
  nome: string;
  email: string;
  valor: string;
  status: PedidoStatus;
  created_at: string;
  data_pagamento?: string;
}

interface EmailjsParams extends Record<string, unknown> {
  client_name: string;
  client_email: string;
  order_id: string;
  total_price: string;
}

export default function PagamentosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<"todos" | PedidoStatus>("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inicializar EmailJS
  useEffect(() => {
    try {
      emailjs.init(emailjsConfig.publicKey);
      console.log('EmailJS inicializado com sucesso');
    } catch (err) {
      console.error('Erro ao inicializar EmailJS:', err);
      setError('Erro ao inicializar o sistema de emails');
    }
  }, []);

  // Carrega pedidos do Supabase
  useEffect(() => {
    const carregarPedidos = async () => {
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
    };

    carregarPedidos();
  }, []);

  const enviarEmails = async (pedido: Pedido) => {
    const emailParams: EmailjsParams = {
      client_name: pedido.nome,
      client_email: pedido.email,
      order_id: pedido.id,
      total_price: pedido.valor,
    };

    try {
      // Email para o cliente
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templates.clientConfirmation,
        emailParams,
        emailjsConfig.publicKey
      );

      // Email para o admin
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templates.adminNotification,
        {
          ...emailParams,
          to_email: emailjsConfig.adminEmail,
        },
        emailjsConfig.publicKey
      );
    } catch (error) {
      console.error('Erro ao enviar emails:', error);
      throw new Error('Erro ao enviar emails de confirmação');
    }
  };

  const confirmarPagamento = async (pedido: Pedido) => {
    try {
      setLoading(true);
      setError(null);
      const dataAtual = new Date().toLocaleString("pt-BR");

      // Atualiza no Supabase
      const { error: updateError } = await supabase
        .from("pedidos")
        .update({ 
          status: "pago" as PedidoStatus, 
          data_pagamento: dataAtual 
        })
        .eq("id", pedido.id);

      if (updateError) {
        throw updateError;
      }

      // Atualiza localmente
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === pedido.id
            ? { ...p, status: "pago", data_pagamento: dataAtual }
            : p
        )
      );

      // Envia emails
      await enviarEmails(pedido);

      alert("Pagamento confirmado e emails enviados com sucesso!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao confirmar pagamento';
      console.error("Erro ao confirmar pagamento:", err);
      setError(errorMessage);
      alert("Erro ao confirmar pagamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const pedidosFiltrados = pedidos.filter((p) =>
    filtro === "todos" ? true : p.status === filtro
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto p-4 text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Painel de Pagamentos</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={() => setFiltro("todos")}
            className={`${
              filtro === "todos" 
                ? "bg-[#FFC0CB] text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            } hover:bg-[#FFB6C1]`}
          >
            Todos ({pedidos.length})
          </Button>
          <Button 
            onClick={() => setFiltro("pendente")}
            className={`${
              filtro === "pendente" 
                ? "bg-[#FFC0CB] text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            } hover:bg-[#FFB6C1]`}
          >
            Pendentes ({pedidos.filter(p => p.status === "pendente").length})
          </Button>
          <Button 
            onClick={() => setFiltro("pago")}
            className={`${
              filtro === "pago" 
                ? "bg-[#FFC0CB] text-white" 
                : "bg-white text-gray-700 border border-gray-300"
            } hover:bg-[#FFB6C1]`}
          >
            Pagos ({pedidos.filter(p => p.status === "pago").length})
          </Button>
        </div>

        <div className="grid gap-4">
          {pedidosFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum pedido encontrado.
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <Card key={pedido.id} className="bg-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{pedido.nome}</p>
                      <p className="text-gray-600">{pedido.email}</p>
                      {pedido.created_at && (
                        <p className="text-sm text-gray-500">
                          Criado em: {new Date(pedido.created_at).toLocaleString("pt-BR")}
                        </p>
                      )}
                      {pedido.data_pagamento && (
                        <p className="text-sm text-gray-500">
                          Pago em: {pedido.data_pagamento}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{pedido.valor}</p>
                      <p className={`font-medium ${
                        pedido.status === "pago" 
                          ? "text-green-600" 
                          : "text-yellow-600"
                      }`}>
                        {pedido.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {pedido.status === "pendente" && (
                    <Button 
                      onClick={() => confirmarPagamento(pedido)}
                      disabled={loading}
                      className="w-full bg-[#FFC0CB] hover:bg-[#FFB6C1] text-white disabled:opacity-50"
                    >
                      {loading ? "Processando..." : "Confirmar Pagamento"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 