-- Fluxo de caixa ligado a movimentos de stock (automático via trigger)
-- Se o CREATE TRIGGER falhar com "syntax error", troca `execute function` por `execute procedure` (versão do Postgres).
-- Entrada (in) → despesa "Compra de stock"
-- Saída (out) → receita "Venda" se sale_price > 0; senão despesa "Utilização de stock" (custo)

alter table public.products
  add column if not exists sale_price numeric(12, 2);

comment on column public.products.sale_price is 'Opcional: preço de venda por unidade; saídas de stock geram receita em cash_flow';

create table if not exists public.cash_flow (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  category text not null check (category in ('stock', 'service', 'other', 'product_sale')),
  amount numeric(12, 2) not null check (amount > 0),
  description text not null,
  stock_movement_id uuid unique references public.stock_movements (id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_cash_flow_created_at on public.cash_flow (created_at desc);
create index if not exists idx_cash_flow_type on public.cash_flow (type);

alter table public.cash_flow enable row level security;

drop policy if exists "cash_flow_admin_all" on public.cash_flow;

create policy "cash_flow_admin_all"
  on public.cash_flow
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

create or replace function public.fn_cash_flow_from_stock_movement()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  pname text;
  sale numeric(12, 2);
  amt numeric(12, 2);
begin
  select p.name, p.sale_price into pname, sale
  from public.products p
  where p.id = new.product_id;

  if coalesce(trim(pname), '') = '' then
    pname := 'Produto';
  end if;

  if new.type = 'in' then
    amt := coalesce(
      new.total_price,
      new.quantity::numeric * coalesce(new.unit_price, 0)
    );
    if amt > 0 then
      insert into public.cash_flow (type, category, amount, description, stock_movement_id)
      values (
        'expense',
        'stock',
        round(amt::numeric, 2),
        'Compra de stock — ' || pname,
        new.id
      );
    end if;

  elsif new.type = 'out' then
    if sale is not null and sale > 0 then
      amt := round(new.quantity::numeric * sale, 2);
      if amt > 0 then
        insert into public.cash_flow (type, category, amount, description, stock_movement_id)
        values (
          'income',
          'product_sale',
          amt,
          'Venda — ' || pname,
          new.id
        );
      end if;
    else
      amt := coalesce(new.total_price, 0);
      if amt > 0 then
        insert into public.cash_flow (type, category, amount, description, stock_movement_id)
        values (
          'expense',
          'stock',
          round(amt::numeric, 2),
          'Utilização de stock — ' || pname,
          new.id
        );
      end if;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_stock_movement_cash_flow on public.stock_movements;

create trigger trg_stock_movement_cash_flow
  after insert on public.stock_movements
  for each row
  execute function public.fn_cash_flow_from_stock_movement();
