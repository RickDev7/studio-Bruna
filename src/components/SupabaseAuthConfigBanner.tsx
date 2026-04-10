'use client'

import { isSupabaseEnvConfigured } from '@/config/supabase-client'

/**
 * Mostra instruções quando NEXT_PUBLIC_SUPABASE_* não estão definidas.
 * Com as variáveis corretas (.env.local ou Vercel), o login/recuperação usam o teu projeto.
 */
export function SupabaseAuthConfigBanner() {
  if (isSupabaseEnvConfigured()) return null

  return (
    <div
      className="mb-6 rounded-lg border border-amber-400/80 bg-amber-50 p-4 text-left text-sm text-amber-950 shadow-sm"
      role="alert"
    >
      <p className="font-semibold text-amber-900">
        Ligação ao Supabase em falta
      </p>
      <p className="mt-2 leading-relaxed text-amber-900/90">
        Para o login e a recuperação de palavra-passe funcionarem com o teu projeto:
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          No{' '}
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-800 underline underline-offset-2"
          >
            Supabase Dashboard
          </a>
          : <strong>Project Settings</strong> → <strong>API</strong> → copia a{' '}
          <strong>Project URL</strong> e a chave <strong>anon public</strong>.
        </li>
        <li>
          <strong>Local:</strong> no ficheiro{' '}
          <code className="rounded bg-amber-100/80 px-1.5 py-0.5 text-xs">
            .env.local
          </code>{' '}
          na raiz do projeto, define:
          <pre className="mt-2 overflow-x-auto rounded border border-amber-200/80 bg-white/80 p-2 text-xs">
            {`NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...`}
          </pre>
          Reinicia o servidor (<code className="text-xs">npm run dev</code>).
        </li>
        <li>
          <strong>Vercel:</strong>{' '}
          <strong>Project → Settings → Environment Variables</strong> — adiciona
          as mesmas duas variáveis para <strong>Production</strong> (e Preview se
          quiseres) e faz <strong>Redeploy</strong>.
        </li>
      </ol>
      <p className="mt-3 text-xs text-amber-800/80">
        No Supabase, em <strong>Authentication → URL Configuration</strong>,
        inclui o URL do site em <strong>Redirect URLs</strong> (ex.{' '}
        <code className="rounded bg-amber-100/80 px-1">https://teu-dominio.pt/**</code>
        ).
      </p>
    </div>
  )
}
