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
        
        -- Extrair o horário do scheduled_at
        UPDATE appointments 
        SET time = scheduled_at::time
        WHERE scheduled_at IS NOT NULL;
        
        -- Tornar a coluna NOT NULL
        ALTER TABLE appointments ALTER COLUMN time SET NOT NULL;
    END IF;
END $$;

-- Criar função para atualizar o campo time
CREATE OR REPLACE FUNCTION update_appointment_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.time = NEW.scheduled_at::time;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para manter o campo time sincronizado
DROP TRIGGER IF EXISTS sync_appointment_time ON appointments;
CREATE TRIGGER sync_appointment_time
    BEFORE INSERT OR UPDATE OF scheduled_at
    ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointment_time();