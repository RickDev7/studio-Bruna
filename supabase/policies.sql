-- Permitir leitura da tabela profiles para usuários autenticados
create policy "Permitir leitura de profiles para usuários autenticados"
on profiles for select
to authenticated
using (true);

-- Permitir usuários atualizarem seus próprios perfis
create policy "Permitir usuários atualizarem seus próprios perfis"
on profiles for update
to authenticated
using (auth.uid() = id);

-- Permitir inserção apenas uma vez por usuário
create policy "Permitir inserção apenas uma vez por usuário"
on profiles for insert
to authenticated
with check (auth.uid() = id);

-- Permitir que admins vejam todos os perfis
create policy "Permitir admins verem todos os perfis"
on profiles for all
to authenticated
using (
  exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  )
); 