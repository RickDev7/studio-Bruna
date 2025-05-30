-- Habilitar RLS para a tabela appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários autenticados criem seus próprios agendamentos
CREATE POLICY "Usuários podem criar seus próprios agendamentos"
ON appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Política para permitir que usuários vejam seus próprios agendamentos
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
ON appointments FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- Política para permitir que usuários atualizem seus próprios agendamentos pendentes
CREATE POLICY "Usuários podem atualizar seus próprios agendamentos pendentes"
ON appointments FOR UPDATE
TO authenticated
USING (
    (auth.uid() = user_id AND status = 'pending') OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
);

-- Política para permitir que usuários excluam seus próprios agendamentos pendentes
CREATE POLICY "Usuários podem excluir seus próprios agendamentos pendentes"
ON appointments FOR DELETE
TO authenticated
USING (
    (auth.uid() = user_id AND status = 'pending') OR
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
); 