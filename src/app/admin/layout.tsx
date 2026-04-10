import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { AdminLayoutChrome } from './AdminLayoutChrome'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="admin-app min-h-screen bg-[var(--bg-main)] p-8 text-center text-[var(--text-main)]">
        <p>Configuração Supabase em falta (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).</p>
      </div>
    )
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        try {
          cookieStore.set(name, value, options)
        } catch {
          /* RSC: cookies só podem ser definidos em Route Handler / Server Action */
        }
      },
      remove(name, options) {
        try {
          cookieStore.set(name, '', { ...options, maxAge: 0 })
        } catch {
          /* idem */
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const role = String(profile?.role ?? '')
    .trim()
    .toLowerCase()
  if (role !== 'admin') {
    redirect('/login?reason=admin_only')
  }

  return <AdminLayoutChrome>{children}</AdminLayoutChrome>
}
