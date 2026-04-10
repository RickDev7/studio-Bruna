-- Contas a pagar (admin) + ligação a cash_flow

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  status text not null check (status in ('pending', 'paid')),
  due_date date not null,
  is_recurring boolean not null default false,
  recurrence_type text,
  created_at timestamptz not null default now(),
  constraint payments_recurrence_ok check (
    (is_recurring = false and recurrence_type is null)
    or (
      is_recurring = true
      and recurrence_type in ('monthly', 'weekly')
    )
  )
);

create index if not exists idx_payments_due_date on public.payments (due_date);
create index if not exists idx_payments_status on public.payments (status);

alter table public.payments enable row level security;

drop policy if exists "payments_admin_all" on public.payments;

create policy "payments_admin_all"
  on public.payments
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- Categoria fixa + referência ao pagamento (evita duplicar despesa)
alter table public.cash_flow
  add column if not exists payment_id uuid references public.payments (id) on delete set null;

create unique index if not exists idx_cash_flow_payment_id_unique
  on public.cash_flow (payment_id)
  where payment_id is not null;

alter table public.cash_flow drop constraint if exists cash_flow_category_check;

alter table public.cash_flow
  add constraint cash_flow_category_check check (
    category in (
      'stock',
      'service',
      'other',
      'product_sale',
      'fixed_cost'
    )
  );
