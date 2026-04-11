/*
  Liga linhas de fluxo de caixa (sinal / pagamento final) ao registo em service_logs.
  ON DELETE CASCADE: ao apagar o service_log, remove-se o espelho em cash_flow.
*/

alter table public.cash_flow
  add column if not exists service_log_id uuid references public.service_logs (id) on delete cascade;

create index if not exists idx_cash_flow_service_log_id
  on public.cash_flow (service_log_id)
  where service_log_id is not null;

comment on column public.cash_flow.service_log_id is
  'Preenchido pelas entradas de receita: mesma fatura que service_logs; a previsao de servico nao duplica estes montantes.';
