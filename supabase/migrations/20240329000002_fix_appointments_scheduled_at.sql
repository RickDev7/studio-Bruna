-- Adicionar coluna scheduled_at se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'scheduled_at'
  ) THEN
    ALTER TABLE appointments ADD COLUMN scheduled_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Atualizar registros existentes para combinar date + time
UPDATE appointments 
SET scheduled_at = (date::date + time::time)::timestamp with time zone
WHERE scheduled_at IS NULL;

-- Adicionar restrição NOT NULL após atualizar os dados
ALTER TABLE appointments ALTER COLUMN scheduled_at SET NOT NULL;

-- Adicionar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);

-- Atualizar as políticas existentes para usar scheduled_at
DROP POLICY IF EXISTS "Permitir inserção de appointments" ON appointments;
CREATE POLICY "Permitir inserção de appointments"
ON appointments FOR INSERT
TO public
WITH CHECK (true); 