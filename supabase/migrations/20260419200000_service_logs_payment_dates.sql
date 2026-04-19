-- Datas de pagamento do sinal e do saldo (calendário), independentes da data de registo.

alter table public.service_logs
  add column if not exists advance_paid_on date,
  add column if not exists remaining_paid_on date;

comment on column public.service_logs.advance_paid_on is
  'Data em que o cliente pagou o sinal (entra no fluxo de caixa com esta data).';

comment on column public.service_logs.remaining_paid_on is
  'Data em que o cliente pagou o saldo na loja (entra no fluxo de caixa com esta data).';
