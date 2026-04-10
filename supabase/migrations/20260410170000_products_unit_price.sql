-- Preço por tipo de unidade (produtos / stock admin)
-- Executar no Supabase SQL Editor se a tabela products já existir sem estas colunas

alter table public.products
  add column if not exists unit_price numeric(12, 2),
  add column if not exists unit_type text not null default 'unidade';

comment on column public.products.unit_price is 'Preço de referência em EUR (opcional)';
comment on column public.products.unit_type is 'unidade, litro, pack, kg, caixa, etc.';
