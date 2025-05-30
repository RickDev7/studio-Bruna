import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Verificar se o usuário está autenticado
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se já existe algum admin
    const { data: admins, error: adminsError } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin');

    if (adminsError) {
      console.error('Erro ao verificar admins:', adminsError);
      throw adminsError;
    }

    // Se já existem admins, não permitir a auto-promoção
    if (admins && admins.length > 0) {
      return NextResponse.json(
        { error: 'Já existem administradores no sistema' },
        { status: 403 }
      );
    }

    // Atualizar o papel do usuário para admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      throw updateError;
    }

    return NextResponse.json({ 
      message: 'Usuário promovido a administrador com sucesso!',
      userId: session.user.id 
    });
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição' },
      { status: 500 }
    );
  }
} 