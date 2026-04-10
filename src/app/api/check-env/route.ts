import { NextResponse } from 'next/server'
import { resolveSupabaseEnvForServer } from '@/lib/loadEnvLocalSupabase'
import {
  parseSupabaseAnonJwtRef,
  parseSupabaseUrlRef,
} from '@/lib/supabaseEnvDebug'

export async function GET() {
  const { url: supabaseUrl, anonKey: supabaseAnon, fontePar } =
    resolveSupabaseEnvForServer()
  const urlRef = supabaseUrl ? parseSupabaseUrlRef(supabaseUrl) : null
  const jwtRef = supabaseAnon ? parseSupabaseAnonJwtRef(supabaseAnon) : null
  const refsAlinhados =
    !urlRef || !jwtRef ? null : urlRef === jwtRef
  const emailUser = process.env.EMAIL_USER?.trim() ?? ''
  const emailPass = process.env.EMAIL_PASS?.trim() ?? ''
  const adminEmail = process.env.ADMIN_EMAIL?.trim() ?? ''

  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? '✅' : '❌',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnon ? '✅' : '❌',
    EMAIL_USER: emailUser ? '✅' : '❌',
    EMAIL_PASS: emailPass ? '✅' : '❌',
    ADMIN_EMAIL: adminEmail ? '✅' : '❌',
    /** Confirma se o Next está a ler o .env.local (prefixos curtos, sem expor segredos). */
    _debug: {
      supabaseUrlLength: supabaseUrl.length,
      supabaseUrlPrefix: supabaseUrl.slice(0, 28),
      anonKeyLength: supabaseAnon.length,
      anonKeyPrefix: supabaseAnon.slice(0, 12),
      urlProjectRef: urlRef,
      anonKeyProjectRef: jwtRef,
      refsAlinhados,
      /** Mesma lógica que `/api/signup`: par completo lido de `.env.local` quando existir. */
      supabaseParFonte: fontePar,
      aviso:
        refsAlinhados === false
          ? 'URL e chave anon são de projetos diferentes. Corrige .env.local ou variáveis de ambiente do Windows.'
          : urlRef === 'ddpfougnudxkirmzzsub'
            ? 'Ainda a usar o ref do projeto antigo. Atualiza o URL e reinicia o dev server.'
            : undefined,
    },
  }

  return NextResponse.json(envVars, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}