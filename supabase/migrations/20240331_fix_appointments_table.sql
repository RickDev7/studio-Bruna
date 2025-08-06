-- Primeiro, vamos criar uma tabela temporária com a estrutura correta
CREATE TABLE appointments_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  date DATE,
  notes TEXT,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Copiar os dados da tabela antiga para a nova (se houver)
INSERT INTO appointments_new (
  id, service_id, scheduled_at, date, notes, user_name, user_email, user_phone, status, created_at, updated_at
)
SELECT 
  id, 
  service_id::UUID, 
  scheduled_at, 
  date, 
  notes, 
  user_name, 
  user_email, 
  user_phone, 
  status, 
  created_at, 
  updated_at
FROM appointments
WHERE service_id IS NOT NULL;

-- Dropar a tabela antiga
DROP TABLE appointments;

-- Renomear a nova tabela
ALTER TABLE appointments_new RENAME TO appointments;

-- Recriar os índices
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);

-- Recriar as políticas de segurança
DROP POLICY IF EXISTS "Usuários podem ver seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem atualizar seus próprios agendamentos" ON appointments;
DROP POLICY IF EXISTS "Usuários podem criar agendamentos" ON appointments;

CREATE POLICY "Usuários podem ver seus próprios agendamentos"
ON appointments FOR SELECT
TO authenticated
USING (
    user_email = auth.jwt()->>'email' OR
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
    user_email = auth.jwt()->>'email' OR
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