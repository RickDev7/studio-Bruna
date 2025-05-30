-- Remover a restrição NOT NULL da coluna user_id se existir
ALTER TABLE appointments ALTER COLUMN user_id DROP NOT NULL;

-- Adicionar coluna user_id se não existir (para compatibilidade)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

-- Atualizar as políticas existentes
DROP POLICY IF EXISTS "Permitir inserção de appointments" ON appointments;
DROP POLICY IF EXISTS "Permitir atualização de appointments pelo proprietário" ON appointments;

-- Criar novas políticas
CREATE POLICY "Permitir inserção de appointments"
ON appointments FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Permitir atualização de appointments pelo proprietário"
ON appointments FOR UPDATE
TO public
USING (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE email = auth.jwt()->>'email'
  )
)
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles 
    WHERE email = auth.jwt()->>'email'
  )
); 