-- Adicionar coluna time se não existir
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'appointments' 
        AND column_name = 'time'
    ) THEN
        ALTER TABLE appointments ADD COLUMN time TIME;
        -- Extrair o horário do scheduled_at se existir
        UPDATE appointments 
        SET time = scheduled_at::time 
        WHERE scheduled_at IS NOT NULL;
    END IF;
END $$;

-- Atualizar a estrutura da tabela appointments
ALTER TABLE appointments
ALTER COLUMN time SET NOT NULL,
ALTER COLUMN date SET NOT NULL;

-- Criar um índice composto para melhorar a performance de buscas por data e hora
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);

-- Atualizar as políticas para incluir verificações de data e hora
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