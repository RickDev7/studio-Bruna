-- Enable RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para appointments
CREATE POLICY "Permitir leitura pública de appointments"
ON appointments FOR SELECT
TO public
USING (true);

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

-- Políticas para profiles
CREATE POLICY "Permitir leitura pública de profiles"
ON profiles FOR SELECT
TO public
USING (true);

CREATE POLICY "Permitir inserção de profiles"
ON profiles FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Permitir atualização de profile pelo proprietário"
ON profiles FOR UPDATE
TO public
USING (email = auth.jwt()->>'email')
WITH CHECK (email = auth.jwt()->>'email');

-- Garantir que as colunas necessárias existam
DO $$ 
BEGIN
  -- Adicionar coluna profile_id se não existir
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'profile_id'
  ) THEN
    ALTER TABLE appointments ADD COLUMN profile_id UUID REFERENCES profiles(id);
  END IF;

  -- Adicionar coluna status se não existir
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE appointments ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;

  -- Adicionar restrição NOT NULL se não existir
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'appointments' 
    AND column_name = 'profile_id' 
    AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE appointments ALTER COLUMN profile_id SET NOT NULL;
  END IF;
END $$; 