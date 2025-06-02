create table if not exists public.business_config (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  phone text not null,
  email text not null,
  business_hours jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar trigger para atualizar o updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_business_config_updated_at
  before update on public.business_config
  for each row
  execute function public.handle_updated_at();

-- Inserir configuração inicial
insert into public.business_config (name, address, phone, email, business_hours)
values (
  'Studio Bruna',
  'Endereço do Studio',
  'Telefone do Studio',
  'bs.aestheticnails@gmail.com',
  '{
    "monday": {
      "start": "09:00",
      "end": "18:00",
      "lunchStart": "13:00",
      "lunchEnd": "14:00"
    },
    "tuesday": {
      "start": "09:00",
      "end": "18:00",
      "lunchStart": "13:00",
      "lunchEnd": "14:00"
    },
    "wednesday": {
      "start": "09:00",
      "end": "18:00",
      "lunchStart": "13:00",
      "lunchEnd": "14:00"
    },
    "thursday": {
      "start": "09:00",
      "end": "18:00",
      "lunchStart": "13:00",
      "lunchEnd": "14:00"
    },
    "friday": {
      "start": "09:00",
      "end": "18:00",
      "lunchStart": "13:00",
      "lunchEnd": "14:00"
    },
    "saturday": {
      "start": "09:00",
      "end": "14:00"
    },
    "sunday": {
      "start": "",
      "end": ""
    }
  }'::jsonb
); 