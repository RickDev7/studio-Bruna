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

// Configuração temporária para debug
const setupEnv = () => {
  if (typeof window === 'undefined') {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://ddpfougnudxkirmzzsub.supabase.co';
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcGZvdWdudWR4a2lybXp6c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjE4MDcsImV4cCI6MjA2MzkzNzgwN30.MoBgeC2Tevc-t3JJLvU9VFtLABvi9inYPqt8jNyo4Io';
    }

    // Configurações de email (opcional para o build)
    process.env.EMAIL_USER = process.env.EMAIL_USER || 'temp@email.com';
    process.env.EMAIL_PASS = process.env.EMAIL_PASS || 'temp_password';
    process.env.ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@email.com';
  }
};

setupEnv(); 