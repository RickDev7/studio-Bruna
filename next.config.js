const fs = require('fs')
const path = require('path')

/**
 * No Windows, variáveis NEXT_PUBLIC_* ao nível do utilizador/sistema têm prioridade
 * sobre .env.local no Next.js — o cliente e o middleware ficam com o projeto errado.
 * Isto lê .env.local e força process.env para URL/anon/service_role do mesmo ficheiro.
 */
function applySupabaseFromEnvLocal() {
  try {
    const filePath = path.join(__dirname, '.env.local')
    if (!fs.existsSync(filePath)) return
    const text = fs.readFileSync(filePath, 'utf8')
    const set = {}
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (
        key === 'NEXT_PUBLIC_SUPABASE_URL' ||
        key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY' ||
        key === 'SUPABASE_SERVICE_ROLE_KEY'
      ) {
        if (value) set[key] = value
      }
    }
    if (set.NEXT_PUBLIC_SUPABASE_URL) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = set.NEXT_PUBLIC_SUPABASE_URL
    }
    if (set.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = set.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
    if (set.SUPABASE_SERVICE_ROLE_KEY) {
      process.env.SUPABASE_SERVICE_ROLE_KEY = set.SUPABASE_SERVICE_ROLE_KEY
    }
  } catch {
    /* ignorar */
  }
}

applySupabaseFromEnvLocal()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Rewrite: o browser pede /favicon.ico; servimos o PNG sem redirect (melhor no Vercel). */
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/favicon-32.png' }]
  },
  images: {
    domains: [],
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
}

module.exports = nextConfig
