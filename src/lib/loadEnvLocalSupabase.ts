import fs from 'node:fs'
import path from 'node:path'

/**
 * Lê URL e chave anon do ficheiro .env.local na raiz do projeto.
 * Útil quando variáveis NEXT_PUBLIC_* ao nível do Windows sobrepõem o .env.local
 * (o Next carrega .env.local mas o sistema ganha prioridade).
 */
export function readSupabaseFromEnvLocalFile(): {
  url: string | undefined
  anonKey: string | undefined
  serviceRoleKey: string | undefined
} {
  try {
    const filePath = path.join(process.cwd(), '.env.local')
    if (!fs.existsSync(filePath)) {
      return { url: undefined, anonKey: undefined, serviceRoleKey: undefined }
    }
    const text = fs.readFileSync(filePath, 'utf8')
    let url: string | undefined
    let anonKey: string | undefined
    let serviceRoleKey: string | undefined
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
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') url = value
      if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') anonKey = value
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') serviceRoleKey = value
    }
    return { url, anonKey, serviceRoleKey }
  } catch {
    return { url: undefined, anonKey: undefined, serviceRoleKey: undefined }
  }
}

/**
 * URL + anon: se `.env.local` tiver ambos definidos, usa esse par (ignora process.env para estes dois).
 * Evita misturar URL nova do ficheiro com chaves antigas nas variáveis de ambiente do Windows.
 */
export function resolveSupabaseEnvForServer(): {
  url: string
  anonKey: string
  serviceRoleKey: string | undefined
  fontePar: 'env.local' | 'misturado'
} {
  const f = readSupabaseFromEnvLocalFile()
  const fu = f.url?.trim()
  const fa = f.anonKey?.trim()
  const hasPairInFile = Boolean(fu && fa)
  const url = hasPairInFile
    ? fu!
    : fu || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
  const anonKey = hasPairInFile
    ? fa!
    : fa || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''
  const serviceRoleKey =
    f.serviceRoleKey?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    undefined
  return {
    url,
    anonKey,
    serviceRoleKey,
    fontePar: hasPairInFile ? 'env.local' : 'misturado',
  }
}
