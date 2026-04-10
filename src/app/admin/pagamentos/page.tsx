'use client'

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AccountsPayablePanel } from '@/components/admin/AccountsPayablePanel'
import { supabase } from '@/config/supabase'
import emailjs from '@emailjs/browser'

type PedidoStatus = 'pendente' | 'pago'

interface Pedido {
  id: string
  nome: string
  email: string
  valor: string
  status: PedidoStatus
  created_at: string
}

const EMAIL_CONFIG = {
  serviceId: 'service_qe1ai6q',
  templateId: 'template_gx390pv',
  publicKey: 'N1LpI9fHAIo0az4XG',
} as const

export default function PagamentosAdmin() {
  const [tab, setTab] = useState<'pedidos' | 'contas'>('pedidos')
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [filtro, setFiltro] = useState<'todos' | PedidoStatus>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarPedidos = useCallback(async () => {
    try {
      setError(null)
      const { data, error: qErr } = await supabase
        .from('pedidos')
        .select('*')
        .order('status', { ascending: true })
        .order('created_at', { ascending: false })

      if (qErr) {
        throw qErr
      }

      if (data) {
        setPedidos(data as Pedido[])
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao carregar pedidos'
      console.error('Erro ao carregar pedidos:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregarPedidos()
  }, [carregarPedidos])

  useEffect(() => {
    emailjs.init({
      publicKey: EMAIL_CONFIG.publicKey,
      limitRate: {
        throttle: 2000,
      },
    })
  }, [])

  const enviarEmails = async (pedido: Pedido) => {
    try {
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
          isPaymentConfirmation: true,
        }),
      })
    } catch (mailErr) {
      console.error('Erro ao enviar emails:', mailErr)
      throw new Error('Erro ao enviar emails de confirmação')
    }
  }

  const confirmarPagamento = async (pedido: Pedido) => {
    try {
      setLoading(true)
      setError(null)

      const { error: updateError } = await supabase
        .from('pedidos')
        .update({ status: 'pago' })
        .eq('id', pedido.id)

      if (updateError) throw updateError

      await enviarEmails(pedido)

      setPedidos(
        pedidos.map((p) => (p.id === pedido.id ? { ...p, status: 'pago' } : p))
      )
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao confirmar pagamento'
      console.error('Erro ao confirmar pagamento:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const pedidosFiltrados = pedidos.filter((pedido) =>
    filtro === 'todos' ? true : pedido.status === filtro
  )

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--text-main)] md:text-4xl">
          Pagamentos
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => setTab('pedidos')}
            className={`rounded-xl border shadow-none transition-all duration-300 ${
              tab === 'pedidos'
                ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
            }`}
          >
            Pedidos de clientes
          </Button>
          <Button
            type="button"
            onClick={() => setTab('contas')}
            className={`rounded-xl border shadow-none transition-all duration-300 ${
              tab === 'contas'
                ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
            }`}
          >
            Contas a pagar
          </Button>
        </div>
      </div>

      {tab === 'contas' ? (
        <AccountsPayablePanel />
      ) : loading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-sm text-[var(--text-main)]/65">
          Carregando...
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() => setFiltro('todos')}
                className={`rounded-xl border shadow-none transition-all duration-300 ${
                  filtro === 'todos'
                    ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                    : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
                }`}
              >
                Todos
              </Button>
              <Button
                type="button"
                onClick={() => setFiltro('pendente')}
                className={`rounded-xl border shadow-none transition-all duration-300 ${
                  filtro === 'pendente'
                    ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                    : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
                }`}
              >
                Pendentes
              </Button>
              <Button
                type="button"
                onClick={() => setFiltro('pago')}
                className={`rounded-xl border shadow-none transition-all duration-300 ${
                  filtro === 'pago'
                    ? 'border-transparent bg-[var(--gold)] text-white hover:brightness-[0.92]'
                    : 'border-[var(--border)] bg-transparent text-[var(--text-main)] hover:bg-[var(--highlight)]'
                }`}
              >
                Pagos
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-2 rounded-2xl border border-[var(--border)] bg-[var(--highlight)] px-5 py-4 text-sm text-[var(--text-main)]">
              {error}
            </div>
          )}

          <div className="grid gap-6">
            {pedidosFiltrados.map((pedido) => (
              <Card
                key={pedido.id}
                className="admin-card overflow-hidden !shadow-none"
              >
                <CardContent className="p-6 md:p-7">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-medium text-[var(--text-main)]">
                        {pedido.nome}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--text-main)]/70">
                        {pedido.email}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-main)]/65">
                        {new Date(pedido.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="mt-3 text-xl font-semibold tabular-nums text-[var(--gold)]">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(parseFloat(pedido.valor))}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300 ${
                          pedido.status === 'pago'
                            ? 'border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text-main)]'
                            : 'border border-[var(--border)] bg-[var(--highlight)] text-[var(--text-main)]'
                        }`}
                      >
                        {pedido.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                      {pedido.status === 'pendente' && (
                        <Button
                          type="button"
                          onClick={() => confirmarPagamento(pedido)}
                          disabled={loading}
                          className="rounded-xl border-0 bg-[var(--gold)] text-white shadow-none transition-all duration-300 hover:brightness-[0.92] disabled:opacity-50"
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
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]/50 py-12 text-center text-sm text-[var(--text-main)]/65">
                Nenhum pagamento encontrado
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
