import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ClientesDashboard } from './ClientesDashboard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClientesPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Verificar se o usuário é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  // Buscar todos os clientes
  const { data: clients } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });

  return <ClientesDashboard initialClients={clients} />;
} 