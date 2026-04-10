-- Tabela de pedidos (referência; migração canónica: supabase/migrations/20260410160000_pedidos.sql)
-- No Supabase SQL Editor, preferir correr o ficheiro em supabase/migrations/

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  valor text not null,
  status text not null check (status in ('pendente', 'pago')),
  data_pagamento text,
  created_at timestamptz not null default now()
);

alter table public.pedidos enable row level security;

-- JWT: auth.role() é 'anon' ou 'authenticated', nunca 'admin'. Usar public.profiles.
