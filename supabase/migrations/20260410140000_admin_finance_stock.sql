-- Financeiro e stock (área admin)
-- Executar no Supabase: SQL Editor → New query → colar → Run
-- Ou: supabase db push / migrate

create table if not exists public.financial_logs (
  id uuid primary key default gen_random_uuid(),
  total_balance numeric(12, 2) not null,
  base_security numeric(12, 2) not null default 450,
  stock_reserved numeric(12, 2) not null default 150,
  net_balance numeric(12, 2) not null,
  salary numeric(12, 2) not null,
  investment numeric(12, 2) not null,
  emergency numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  stock integer not null default 0,
  min_stock integer not null default 0,
  unit_price numeric(12, 2),
  unit_type text not null default 'unit',
  cost_per_unit numeric(12, 2),
  total_value numeric(12, 2) not null default 0,
  sale_price numeric(12, 2)
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  type text not null check (type in ('in', 'out')),
  quantity integer not null check (quantity > 0),
  unit_type text,
  unit_price numeric(12, 2),
  total_price numeric(12, 2),
  created_at timestamptz not null default now()
);

create index if not exists idx_stock_movements_product_id on public.stock_movements (product_id);
create index if not exists idx_stock_movements_created_at on public.stock_movements (created_at desc);
create index if not exists idx_financial_logs_created_at on public.financial_logs (created_at desc);

alter table public.financial_logs enable row level security;
alter table public.products enable row level security;
alter table public.stock_movements enable row level security;

drop policy if exists "financial_logs_authenticated_all" on public.financial_logs;
drop policy if exists "financial_logs_admin_all" on public.financial_logs;
drop policy if exists "products_authenticated_all" on public.products;
drop policy if exists "products_admin_all" on public.products;
drop policy if exists "stock_movements_authenticated_all" on public.stock_movements;
drop policy if exists "stock_movements_admin_all" on public.stock_movements;

-- Só utilizadores com role = 'admin' em profiles
create policy "financial_logs_admin_all"
  on public.financial_logs
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

create policy "products_admin_all"
  on public.products
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

create policy "stock_movements_admin_all"
  on public.stock_movements
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
