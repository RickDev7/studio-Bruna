-- Adicionar colunas para dados do usuário
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT,
ADD COLUMN IF NOT EXISTS user_phone TEXT;

-- Criar índices para melhorar performance de busca
CREATE INDEX IF NOT EXISTS idx_appointments_user_email ON appointments(user_email);
CREATE INDEX IF NOT EXISTS idx_appointments_user_name ON appointments(user_name);

-- Atualizar a política de inserção para incluir os novos campos
DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON appointments;

CREATE POLICY "Usuários podem criar agendamentos"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (true); 