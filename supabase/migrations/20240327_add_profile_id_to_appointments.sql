-- Remover políticas existentes primeiro
DROP POLICY IF EXISTS "Usuários podem criar seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON appointments;

-- Adicionar coluna profile_id na tabela appointments se ela não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'profile_id'
    ) THEN
        ALTER TABLE appointments
        ADD COLUMN profile_id UUID REFERENCES profiles(id);

        -- Atualizar os registros existentes para usar o user_id como profile_id
        UPDATE appointments
        SET profile_id = user_id
        WHERE profile_id IS NULL;

        -- Tornar a coluna profile_id NOT NULL após a atualização
        ALTER TABLE appointments
        ALTER COLUMN profile_id SET NOT NULL;

        -- Adicionar índice para melhorar performance
        CREATE INDEX IF NOT EXISTS appointments_profile_id_idx ON appointments(profile_id);
    END IF;
END $$;

-- Atualizar as políticas para usar profile_id
DROP POLICY IF EXISTS "Usuários podem criar seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON appointments;

-- Recriar as políticas usando profile_id
CREATE POLICY "Usuários podem criar seus próprios agendamentos"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver seus próprios agendamentos"
ON appointments FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
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
        AND profiles.is_admin = true
    )
)
WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
); 