-- Método de pagamento distinto para sinal vs saldo

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
