-- Correr UMA VEZ no Supabase → SQL Editor (produção) se a app devolver 400 em service_logs.
-- Isto aplica o equivalente a: 20260419180000 + 20260419200000 (idempotente o possível).

-- 1) Datas de pagamento
alter table public.service_logs
  add column if not exists advance_paid_on date,
  add column if not exists remaining_paid_on date;

-- 2) Meios de pagamento
-- IMPORTANTE: primeiro DROP do check antigo; senão UPDATE cash→numerario falha (23514).
alter table public.service_logs
  drop constraint if exists service_logs_payment_method_check;

update public.service_logs
set payment_method = 'numerario'
where payment_method = 'cash';

update public.service_logs
set payment_method = 'paypal'
where payment_method = 'card';

update public.service_logs
set payment_method = 'fresha'
where payment_method = 'mixed';

alter table public.service_logs
  alter column payment_method set default 'fresha';

alter table public.service_logs
  add constraint service_logs_payment_method_check check (
    payment_method in (
      'fresha',
      'paypal',
      'numerario',
      'transferencia_bancaria'
    )
  );

-- 3) Método de pagamento separado (sinal vs saldo)
alter table public.service_logs
  add column if not exists advance_payment_method text,
  add column if not exists remaining_payment_method text;

update public.service_logs
set
  advance_payment_method = coalesce(advance_payment_method, payment_method),
  remaining_payment_method = coalesce(remaining_payment_method, payment_method)
where advance_payment_method is null
   or remaining_payment_method is null;

alter table public.service_logs
  drop constraint if exists service_logs_advance_payment_method_check;

alter table public.service_logs
  drop constraint if exists service_logs_remaining_payment_method_check;

alter table public.service_logs
  add constraint service_logs_advance_payment_method_check check (
    advance_payment_method is null
    or advance_payment_method in (
      'fresha',
      'paypal',
      'numerario',
      'transferencia_bancaria'
    )
  );

alter table public.service_logs
  add constraint service_logs_remaining_payment_method_check check (
    remaining_payment_method is null
    or remaining_payment_method in (
      'fresha',
      'paypal',
      'numerario',
      'transferencia_bancaria'
    )
  );
