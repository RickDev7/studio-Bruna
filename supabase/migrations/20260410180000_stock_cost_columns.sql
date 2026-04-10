-- Custos de stock: custo unitário, valor total em inventário, detalhe nos movimentos

alter table public.products
  add column if not exists cost_per_unit numeric(12, 2),
  add column if not exists total_value numeric(12, 2) not null default 0;

comment on column public.products.cost_per_unit is 'Custo/preço de referência por unidade (EUR)';
comment on column public.products.total_value is 'Valor total do inventário (EUR)';

alter table public.stock_movements
  add column if not exists unit_type text,
  add column if not exists unit_price numeric(12, 2),
  add column if not exists total_price numeric(12, 2);

comment on column public.stock_movements.unit_type is 'unit | pack | liters (espelho do produto na data do movimento)';
comment on column public.stock_movements.unit_price is 'Preço/custo unitário aplicado neste movimento (EUR)';
comment on column public.stock_movements.total_price is 'quantity * unit_price para entrada; valor retirado na saída (EUR)';

-- Normalizar unit_type para valores pedidos (unit | pack | liters)
update public.products
set unit_type = 'liters'
where lower(trim(unit_type)) in ('litro', 'litros', 'liter', 'liters');

update public.products
set unit_type = 'pack'
where lower(trim(unit_type)) in ('pack', 'caixa');

update public.products
set unit_type = 'unit'
where unit_type is null
   or trim(unit_type) = ''
   or lower(trim(unit_type)) in ('unidade', 'unit', 'units');

update public.products
set unit_type = 'unit'
where unit_type not in ('unit', 'pack', 'liters');

alter table public.products
  alter column unit_type set default 'unit';

-- Preencher custo a partir de unit_price legado
update public.products
set cost_per_unit = unit_price
where cost_per_unit is null
  and unit_price is not null;

-- Valor de inventário aproximado quando há stock e custo mas total ainda zero
update public.products
set total_value = round((stock::numeric * cost_per_unit)::numeric, 2)
where coalesce(total_value, 0) = 0
  and stock > 0
  and cost_per_unit is not null;
