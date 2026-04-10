-- Realtime: permitir postgres_changes no cliente admin (Finanças)
-- Requer políticas RLS com SELECT (já existem: cash_flow_admin_all, payments_admin_all).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'cash_flow'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cash_flow;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'payments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
  END IF;
END $$;
