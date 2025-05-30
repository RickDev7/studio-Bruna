-- Adicionar coluna profile_id na tabela appointments
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
CREATE INDEX appointments_profile_id_idx ON appointments(profile_id); 