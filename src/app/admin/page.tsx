import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Verificar se o usuário é admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Buscar todos os agendamentos com os dados dos usuários
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      *,
      profile:profiles (
        full_name,
        email
      )
    `)
    .order('scheduled_at', { ascending: true })

  return <AdminDashboard initialAppointments={appointments || []} />
} 