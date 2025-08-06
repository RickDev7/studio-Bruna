-- Renomear a coluna service para service_id
ALTER TABLE appointments 
RENAME COLUMN service TO service_id;

-- Garantir que service_id é uma chave estrangeira para services
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'appointments_service_id_fkey'
    ) THEN
        ALTER TABLE appointments
        ADD CONSTRAINT appointments_service_id_fkey
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE RESTRICT;
    END IF;
END $$; 