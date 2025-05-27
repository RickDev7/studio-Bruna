-- Criar a tabela de pedidos
create table public.pedidos (
    id uuid default uuid_generate_v4() primary key,
    nome text not null,
    email text not null,
    valor text not null,
    status text not null check (status in ('pendente', 'pago')),
    data_pagamento text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security)
alter table public.pedidos enable row level security;

-- Criar políticas de segurança

-- Política para leitura (apenas usuários autenticados podem ler)
create policy "Usuários autenticados podem ler pedidos"
    on public.pedidos
    for select
    to authenticated
    using (true);

-- Política para inserção (qualquer pessoa pode criar um pedido)
create policy "Qualquer pessoa pode criar pedidos"
    on public.pedidos
    for insert
    to anon
    with check (true);

-- Política para atualização (apenas admins podem atualizar)
create policy "Apenas admins podem atualizar pedidos"
    on public.pedidos
    for update
    to authenticated
    using (auth.role() = 'admin')
    with check (auth.role() = 'admin');

-- Índices para melhor performance
create index pedidos_status_idx on public.pedidos(status);
create index pedidos_created_at_idx on public.pedidos(created_at desc); 