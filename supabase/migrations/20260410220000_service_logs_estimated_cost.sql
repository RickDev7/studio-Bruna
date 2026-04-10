-- Catálogo de serviços + lucro por atendimento
-- Cria `services` se ainda não existir (projetos sem migrações antigas).

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null default 'geral',
  duration integer not null default 60,
  price numeric(12, 2) not null,
  description text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  estimated_cost numeric(12, 2) not null default 0
);

alter table public.services
  add column if not exists estimated_cost numeric(12, 2) not null default 0;

create index if not exists idx_services_category on public.services (category);
create index if not exists idx_services_active on public.services (active);

alter table public.services enable row level security;

drop policy if exists "Serviços podem ser visualizados por todos" on public.services;
drop policy if exists "Apenas administradores podem modificar serviços" on public.services;

create policy "Serviços podem ser visualizados por todos"
  on public.services
  for select
  to authenticated
  using (true);

create policy "Apenas administradores podem modificar serviços"
  on public.services
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

create table if not exists public.service_logs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services (id) on delete restrict,
  quantity integer not null default 1 check (quantity > 0),
  total_revenue numeric(12, 2) not null,
  total_cost numeric(12, 2) not null,
  profit numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_service_logs_service_id on public.service_logs (service_id);
create index if not exists idx_service_logs_created_at on public.service_logs (created_at desc);

alter table public.service_logs enable row level security;

drop policy if exists "service_logs_admin_all" on public.service_logs;

create policy "service_logs_admin_all"
  on public.service_logs
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

-- Realtime (Finanças)
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'service_logs'
  ) then
    alter publication supabase_realtime add table public.service_logs;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'stock_movements'
  ) then
    alter publication supabase_realtime add table public.stock_movements;
  end if;
end $$;
