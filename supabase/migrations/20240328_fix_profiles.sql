-- Primeiro, remover todas as políticas que dependem de is_admin
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Admins podem atualizar todos os perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios perfis" ON profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios perfis" ON profiles;

-- Adicionar coluna role se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;
END $$;

-- Copiar os valores de is_admin para role
UPDATE profiles
SET role = CASE 
    WHEN is_admin = true THEN 'admin'
    ELSE 'user'
END
WHERE role IS NULL;

-- Agora podemos remover a coluna is_admin com segurança
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE profiles DROP COLUMN is_admin;
    END IF;
END $$;

-- Recriar as políticas usando role
CREATE POLICY "Usuários podem ver seus próprios perfis"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR role = 'admin');

CREATE POLICY "Usuários podem atualizar seus próprios perfis"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR role = 'admin');

-- Recriar as políticas de appointments usando role
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
ON appointments FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos"
ON appointments FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Garantir que todos os perfis tenham um role definido
UPDATE profiles
SET role = 'user'
WHERE role IS NULL; 