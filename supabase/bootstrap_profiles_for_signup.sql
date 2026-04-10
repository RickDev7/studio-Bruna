-- Executar UMA vez no SQL Editor do Supabase (projeto novo).
-- Alinha `public.profiles` com src/types/database.types.ts e com /api/auth/signup

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migração suave se já existia tabela antiga (coluna `name`)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Só referencia `name` se essa coluna existir (evita erro 42703)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'name'
  ) THEN
    UPDATE public.profiles
    SET full_name = COALESCE(full_name, name);
  END IF;
END $$;

UPDATE public.profiles SET role = COALESCE(role, 'user') WHERE role IS NULL;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Utilizadores podem inserir o próprio perfil" ON public.profiles;
CREATE POLICY "Utilizadores podem inserir o próprio perfil"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Utilizadores podem ver o próprio perfil" ON public.profiles;
CREATE POLICY "Utilizadores podem ver o próprio perfil"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Utilizadores podem atualizar o próprio perfil" ON public.profiles;
CREATE POLICY "Utilizadores podem atualizar o próprio perfil"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);
