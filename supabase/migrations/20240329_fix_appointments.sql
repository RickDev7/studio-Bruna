-- Adicionar coluna date se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'date'
    ) THEN
        ALTER TABLE appointments ADD COLUMN date DATE;
        -- Extrair a data do scheduled_at se existir
        UPDATE appointments 
        SET date = scheduled_at::date 
        WHERE scheduled_at IS NOT NULL;
    END IF;
END $$;

-- Garantir que user_id é uma chave estrangeira para profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'appointments_user_id_fkey'
    ) THEN
        ALTER TABLE appointments
        ADD CONSTRAINT appointments_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Criar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);

-- Atualizar as políticas de segurança para usar a nova estrutura
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON appointments;

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