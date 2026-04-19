-- Meios de pagamento: fresha, paypal, numerario, transferencia bancaria
-- Migra registos antigos (cash, card, mixed) para o novo conjunto.
-- Ordem: DROP do check antes dos UPDATE — senão cash→numerario viola o check antigo.

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
