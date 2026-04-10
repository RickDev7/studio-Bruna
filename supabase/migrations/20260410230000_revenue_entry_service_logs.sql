-- Entrada manual de receitas: service_logs + categorias em cash_flow

alter table public.service_logs
  alter column service_id drop not null;

alter table public.service_logs
  add column if not exists client_name text,
  add column if not exists service_name text,
  add column if not exists total_price numeric(12, 2),
  add column if not exists advance_paid numeric(12, 2) not null default 0,
  add column if not exists remaining_paid numeric(12, 2) not null default 0,
  add column if not exists payment_method text not null default 'mixed';

update public.service_logs
set total_price = total_revenue
where total_price is null;

update public.service_logs
set
  remaining_paid = total_revenue,
  advance_paid = 0
where client_name is null
  and total_price is not null
  and remaining_paid = 0
  and advance_paid = 0;

alter table public.service_logs
  alter column total_price set not null;

alter table public.service_logs
  drop constraint if exists service_logs_payment_method_check;

alter table public.service_logs
  add constraint service_logs_payment_method_check check (
    payment_method in ('cash', 'card', 'mixed')
  );

alter table public.service_logs
  drop constraint if exists service_logs_client_or_service_check;

alter table public.service_logs
  add constraint service_logs_client_or_service_check check (
    service_id is not null
    or (
      client_name is not null
      and length(trim(client_name)) > 0
    )
  );

alter table public.cash_flow drop constraint if exists cash_flow_category_check;

alter table public.cash_flow
  add constraint cash_flow_category_check check (
    category in (
      'stock',
      'service',
      'service_advance',
      'service_payment',
      'other',
      'product_sale',
      'fixed_cost'
    )
  );
