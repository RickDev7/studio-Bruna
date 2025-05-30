-- Criar a publicação se não existir
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

-- Habilitar replicação para a tabela appointments
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- Habilitar realtime para a tabela appointments
BEGIN;
  -- Adicionar a tabela à lista de tabelas com realtime habilitado
  INSERT INTO _realtime.subscription_tables (table_name)
  VALUES ('appointments')
  ON CONFLICT (table_name) DO NOTHING;
  
  -- Configurar as colunas que serão transmitidas
  INSERT INTO _realtime.subscription_columns (table_name, column_name)
  VALUES
    ('appointments', 'id'),
    ('appointments', 'user_id'),
    ('appointments', 'service'),
    ('appointments', 'scheduled_at'),
    ('appointments', 'status'),
    ('appointments', 'notes'),
    ('appointments', 'created_at'),
    ('appointments', 'updated_at')
  ON CONFLICT (table_name, column_name) DO NOTHING;
COMMIT; 