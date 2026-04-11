import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database.types'
import type { PostgrestError } from '@supabase/supabase-js'
import { resolveSupabaseEnvForServer } from '@/lib/loadEnvLocalSupabase'
import {
  parseSupabaseAnonJwtRef,
  parseSupabaseUrlRef,
} from '@/lib/supabaseEnvDebug'

const PROFILE_UPSERT_ATTEMPTS = 6
const PROFILE_UPSERT_DELAY_MS = 500

async function upsertProfileWithRetry(
  client: ReturnType<typeof createClient<Database>>,
  row: {
    id: string
    email: string
    full_name: string | null
    phone: string | null
    role: string
  }
): Promise<{ error: PostgrestError | null }> {
  let last: PostgrestError | null = null
  for (let attempt = 1; attempt <= PROFILE_UPSERT_ATTEMPTS; attempt++) {
    const { error } = await client.from('profiles').upsert(row, { onConflict: 'id' })
    if (!error) return { error: null }
    last = error
    const retryable = error.code === '23503' && attempt < PROFILE_UPSERT_ATTEMPTS
    if (!retryable) return { error }
    await new Promise((r) => setTimeout(r, PROFILE_UPSERT_DELAY_MS))
  }
  return { error: last }
}

export const dynamic = 'force-dynamic'

function explainProfileError(err: PostgrestError): string {
  const msg = err.message || ''
  if (
    msg.includes('full_name') ||
    msg.includes('column') ||
    msg.includes('Could not find')
  ) {
    return (
      'A tabela `profiles` não tem as colunas que a app espera (`full_name`, `role`, etc.). ' +
      'No Supabase → SQL Editor, executa o ficheiro `supabase/bootstrap_profiles_for_signup.sql` deste repositório.'
    )
  }
  if (
    msg.includes('does not exist') ||
    msg.includes('schema cache') ||
    err.code === '42P01'
  ) {
    return (
      'A tabela `profiles` não existe neste projeto Supabase. ' +
      'Abre o SQL Editor e executa as migrações da pasta `supabase/migrations` do repositório (começando pelas mais antigas), ou cria a tabela `profiles` conforme o projeto.'
    )
  }
  if (
    msg.includes('row-level security') ||
    msg.includes('violates row-level security') ||
    err.code === '42501'
  ) {
    return (
      'O registo no Auth funcionou, mas não foi possível criar a linha em `profiles` (políticas RLS). ' +
      'Soluções: (1) Coloca no `.env.local` a `SUPABASE_SERVICE_ROLE_KEY` do **mesmo** projeto (Settings → API → legado service_role) e reinicia o servidor; ' +
      'ou (2) ajusta as políticas RLS de `profiles` para permitir insert após registo.'
    )
  }
  if (err.code === '23505' || msg.includes('duplicate key')) {
    return 'Este email ou utilizador já está registado. Tenta fazer login ou usa outro email.'
  }
  if (err.code === '23503' || msg.includes('profiles_id_fkey')) {
    return (
      'O perfil não pôde ser associado ao utilizador (referência inválida). ' +
      'Causas frequentes: (1) `SUPABASE_SERVICE_ROLE_KEY` no `.env.local` é de **outro** projeto Supabase que a URL/anon key — corrige em Settings → API; ' +
      '(2) falta `SUPABASE_SERVICE_ROLE_KEY` com confirmação de email ativa — adiciona a chave **service_role** do mesmo projeto ou desativa confirmação de email temporariamente.'
    )
  }
  return msg
}

export async function POST(request: Request) {
  let body: {
    email?: string
    password?: string
    fullName?: string
    phone?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }

  const email = body.email?.trim()
  const password = body.password
  const fullName = body.fullName?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''

  if (!email || !password) {
    return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: 'A senha deve ter pelo menos 6 caracteres' },
      { status: 400 }
    )
  }
  if (phone && !/^[0-9]{10,11}$/.test(phone)) {
    return NextResponse.json(
      { error: 'O telefone deve ter 10 ou 11 dígitos' },
      { status: 400 }
    )
  }

  const { url, anonKey: key, serviceRoleKey: serviceKeyFromEnv } =
    resolveSupabaseEnvForServer()
  if (!url || !key) {
    return NextResponse.json(
      {
        error:
          'Configuração Supabase em falta no servidor (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).',
      },
      { status: 500 }
    )
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'NEXT_PUBLIC_SUPABASE_URL deve começar por https://' },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_SUPABASE_URL não é um URL válido.' },
      { status: 500 }
    )
  }

  try {
    const supabase = createClient<Database>(url, key)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    })

    if (error) {
      const raw =
        typeof error.message === 'string' ? error.message : String(error.message ?? '')
      const lower = raw.toLowerCase()
      if (lower.includes('fetch failed') || lower === 'networkerror') {
        const refFromUrl = parseSupabaseUrlRef(url)
        const refFromJwt = parseSupabaseAnonJwtRef(key)
        const refsAlinhados =
          !refFromUrl || !refFromJwt || refFromUrl === refFromJwt
        let hint =
          'Reinicia com: npm run dev (já usa IPv4 primeiro). Firewall/VPN/antivírus, ou no PowerShell: curl -I ' +
          url.replace(/\/$/, '') +
          '/auth/v1/health'
        if (!refsAlinhados) {
          hint =
            `URL aponta ao projeto "${refFromUrl}" mas a chave anon é do "${refFromJwt}". Corrige .env.local para ambos serem o mesmo projeto. ` +
            hint
        }
        if (refFromUrl === 'ddpfougnudxkirmzzsub') {
          hint =
            'O servidor está a usar o projeto Supabase ANTIGO (ddpf…). Atualiza NEXT_PUBLIC_SUPABASE_URL no .env.local. ' +
            'No Windows: Painel → Variáveis de ambiente → remove NEXT_PUBLIC_SUPABASE_URL / ANON_KEY se estiverem definidas ao nível do utilizador ou sistema (sobrepõem o .env.local). ' +
            'Não voltes a correr scripts/setup-env.js sem editar — ele sobrescreve o .env.local. ' +
            hint
        }
        return NextResponse.json(
          {
            error: 'O Node.js não conseguiu ligar ao Supabase (fetch failed). ' + hint,
            code: (error as { status?: number }).status,
            raw,
            debug: {
              urlProjectRef: refFromUrl,
              anonKeyProjectRef: refFromJwt,
              refsAlinhados,
            },
          },
          { status: 502 }
        )
      }
      const msg = raw.includes('Email rate limit')
        ? 'Muitas tentativas. Por favor, aguarde alguns minutos.'
        : raw.trim() || 'Erro do Supabase Auth (sem mensagem). Verifica o email, a password e se o registo por email está ativo.'
      return NextResponse.json(
        { error: msg, code: (error as { status?: number }).status, raw: raw || undefined },
        { status: 400 }
      )
    }

    if (!data.user?.id) {
      return NextResponse.json({ error: 'Registo incompleto' }, { status: 400 })
    }

    const serviceKey = serviceKeyFromEnv
    const urlRef = parseSupabaseUrlRef(url)
    const anonRef = parseSupabaseAnonJwtRef(key)
    if (urlRef && anonRef && urlRef !== anonRef) {
      return NextResponse.json(
        {
          error:
            `NEXT_PUBLIC_SUPABASE_URL aponta ao projeto "${urlRef}" mas a chave anon é do "${anonRef}". Corrige o .env.local para o mesmo projeto.`,
          code: 'project_mismatch',
        },
        { status: 500 }
      )
    }

    let profileClient: ReturnType<typeof createClient<Database>>

    if (serviceKey) {
      const svcRef = parseSupabaseAnonJwtRef(serviceKey)
      if (urlRef && svcRef && urlRef !== svcRef) {
        return NextResponse.json(
          {
            error:
              `SUPABASE_SERVICE_ROLE_KEY é do projeto "${svcRef}" mas a URL é "${urlRef}". Usa a service_role do mesmo projeto (Settings → API).`,
            code: 'service_project_mismatch',
          },
          { status: 500 }
        )
      }
      profileClient = createClient<Database>(url, serviceKey)
    } else if (data.session) {
      profileClient = createClient<Database>(url, key)
      await profileClient.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    } else {
      return NextResponse.json(
        {
          error:
            'O registo foi criado no Auth mas não há sessão (confirmação de email ativa). ' +
            'Adiciona `SUPABASE_SERVICE_ROLE_KEY` do **mesmo** projeto ao `.env.local` e reinicia o servidor, ' +
            'ou desativa temporariamente a confirmação de email em Authentication → Providers → Email.',
          code: 'needs_service_role',
        },
        { status: 400 }
      )
    }

    const { error: profileError } = await upsertProfileWithRetry(profileClient, {
      id: data.user.id,
      email,
      full_name: fullName || null,
      phone: phone || null,
      role: 'user',
    })

    if (profileError) {
      const explained = explainProfileError(profileError)
      const raw = profileError.message ?? ''
      return NextResponse.json(
        {
          error: explained.trim() || raw || 'Erro ao guardar perfil.',
          code: profileError.code,
          raw: raw || undefined,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : 'Erro ao contactar o Supabase.'
    return NextResponse.json(
      {
        error: `Supabase indisponível ou URL inválida: ${message}. Confirma NEXT_PUBLIC_SUPABASE_URL no .env.local e que o projeto não está pausado.`,
      },
      { status: 502 }
    )
  }
}
