import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Verificar se o usuário existe na tabela profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      
      // Se o perfil não existe, criar um novo
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: session.user.id,
            email: session.user.email,
            role: 'user'
          }
        ]);

      if (insertError) {
        throw insertError;
      }

      return NextResponse.json({ isAdmin: false });
    }

    // Se o perfil existe mas não tem role definida, atualizar para 'user'
    if (!profile.role) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', session.user.id);

      if (updateError) {
        throw updateError;
      }
    }

    return NextResponse.json({ 
      isAdmin: profile.role === 'admin',
      profile 
    });

  } catch (error) {
    console.error('Erro ao verificar status de admin:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 