-- Remover políticas existentes
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON profiles;

-- Criar novas políticas sem recursão
CREATE POLICY "Permitir leitura pública de perfis"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir inserção de perfis"
ON profiles FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id); 