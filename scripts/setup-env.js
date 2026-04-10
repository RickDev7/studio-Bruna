const fs = require('fs');
const path = require('path');

// NÃO coloques aqui URLs/chaves reais de projetos antigos — isto SOBRESCREVE o .env.local inteiro.
// Preenche com os valores do teu projeto: Supabase → Settings → API
const envContent = `# Supabase (substituir pelos teus)
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_aqui_a_chave_anon

EMAIL_USER=temp@email.com
EMAIL_PASS=temp_password
ADMIN_EMAIL=admin@email.com`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });
  console.log('✅ Arquivo .env.local criado com sucesso');
} catch (error) {
  console.error('❌ Erro ao criar arquivo .env.local:', error);
} 