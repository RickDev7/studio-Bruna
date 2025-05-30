import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { Database } from '@/types/database.types';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Verificar se o usuário está autenticado
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Erro ao verificar sessão:', sessionError);
      return NextResponse.json(
        { error: 'Erro ao verificar autenticação' },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Você precisa estar logado para acessar esta rota' },
        { status: 401 }
      );
    }

    // Verificar se o usuário já é admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao verificar perfil:', profileError);
      return NextResponse.json(
        { error: 'Erro ao verificar perfil do usuário' },
        { status: 500 }
      );
    }

    if (profile?.role === 'admin') {
      return NextResponse.json(
        { message: 'Usuário já é admin' },
        { status: 200 }
      );
    }

    // Atualizar o perfil do usuário para admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', session.user.id);

    if (updateError) {
      console.error('Erro ao atualizar perfil:', updateError);
      return NextResponse.json(
        { error: 'Erro ao adicionar role de admin' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Role de admin adicionada com sucesso',
      userId: session.user.id 
    });
  } catch (error) {
    console.error('Erro ao adicionar role de admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 