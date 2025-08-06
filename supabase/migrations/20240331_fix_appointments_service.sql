-- Adicionar coluna service_id e criar relação com a tabela services
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES services(id);

-- Criar índice para melhorar performance
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);

-- Atualizar as políticas de segurança
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

CREATE POLICY "Usuários podem criar agendamentos"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (true); 