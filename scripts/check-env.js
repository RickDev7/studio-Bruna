const fs = require('fs');
const path = require('path');

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    // Verifica se o arquivo existe
    if (!fs.existsSync(envPath)) {
      console.error('❌ Arquivo .env.local não encontrado');
      return false;
    }

    // Lê o conteúdo do arquivo
    const content = fs.readFileSync(envPath, 'utf8');
    
    // Verifica o encoding (procura por BOM)
    if (content.charCodeAt(0) === 0xFEFF) {
      console.warn('⚠️ Arquivo .env.local contém BOM. Isso pode causar problemas.');
    }

    // Verifica as variáveis necessárias
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];

    const missingVars = [];
    for (const varName of requiredVars) {
      if (!content.includes(`${varName}=`)) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      console.error(`❌ Variáveis faltando no .env.local: ${missingVars.join(', ')}`);
      return false;
    }

    console.log('✅ Arquivo .env.local está configurado corretamente');
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar .env.local:', error);
    return false;
  }
}

checkEnvFile(); 