const fs = require('fs');
const path = require('path');

const envContent = `NEXT_PUBLIC_SUPABASE_URL=https://ddpfougnudxkirmzzsub.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcGZvdWdudWR4a2lybXp6c3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjE4MDcsImV4cCI6MjA2MzkzNzgwN30.MoBgeC2Tevc-t3JJLvU9VFtLABvi9inYPqt8jNyo4Io
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