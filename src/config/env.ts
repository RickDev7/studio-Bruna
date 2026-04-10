const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`⚠️ A variável de ambiente ${key} não está definida`);
    return '';
  }
  return value;
};

export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

// Validação das variáveis de ambiente
if (!env.supabase.url || !env.supabase.anonKey) {
  throw new Error(
    'Variáveis de ambiente do Supabase não encontradas. ' +
    'Crie um arquivo .env.local na raiz do projeto com:\n\n' +
    'NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase\n' +
    'NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase'
  );
} 

// Não injetar URL/chave Supabase por código — usa sempre .env.local (projeto certo).
const setupEnv = () => {
  if (typeof window === 'undefined') {
    process.env.EMAIL_USER = process.env.EMAIL_USER || 'temp@email.com';
    process.env.EMAIL_PASS = process.env.EMAIL_PASS || 'temp_password';
    process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@email.com';
  }
};

setupEnv();