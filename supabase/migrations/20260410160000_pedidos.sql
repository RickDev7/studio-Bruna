-- Tabela de pedidos / pagamentos (admin/pagamentos + checkout público)
-- Executar no Supabase SQL Editor se ainda não existir public.pedidos

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  valor text not null,
  status text not null check (status in ('pendente', 'pago')),
  data_pagamento text,
  created_at timestamptz not null default now()
);

create index if not exists pedidos_status_idx on public.pedidos (status);
create index if not exists pedidos_created_at_idx on public.pedidos (created_at desc);

alter table public.pedidos enable row level security;

drop policy if exists "Usuários autenticados podem ler pedidos" on public.pedidos;
drop policy if exists "Qualquer pessoa pode criar pedidos" on public.pedidos;
drop policy if exists "Apenas admins podem atualizar pedidos" on public.pedidos;
drop policy if exists "pedidos_insert_public" on public.pedidos;
drop policy if exists "pedidos_select_admin" on public.pedidos;
drop policy if exists "pedidos_update_admin" on public.pedidos;

-- Checkout / site: criar pedido sem login (anon) ou com sessão
create policy "pedidos_insert_public"
  on public.pedidos
  for insert
  to anon, authenticated
  with check (true);

-- Painel admin: só profiles.role = 'admin' (auth.role() nunca é 'admin' no JWT)
create policy "pedidos_select_admin"
  on public.pedidos
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );

create policy "pedidos_update_admin"
  on public.pedidos
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'admin'
    )
  );
