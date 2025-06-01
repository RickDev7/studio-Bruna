const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const LOGO_SVG_PATH = path.join(__dirname, '../public/logo.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  if (!fs.existsSync(LOGO_SVG_PATH)) {
    console.error('❌ Arquivo logo.svg não encontrado em /public');
    return;
  }

  const sizes = {
    'favicon.png': { width: 32, height: 32 },
    'android-chrome-192x192.png': { width: 192, height: 192 },
    'android-chrome-512x512.png': { width: 512, height: 512 },
    'apple-touch-icon.png': { width: 180, height: 180 },
  };

  // Gerar todos os ícones
  for (const [filename, size] of Object.entries(sizes)) {
    try {
      await sharp(LOGO_SVG_PATH)
        .resize(size.width, size.height)
        .toFile(path.join(PUBLIC_DIR, filename));
      
      console.log(`✅ Gerado: ${filename}`);
    } catch (error) {
      console.error(`❌ Erro ao gerar ${filename}:`, error);
    }
  }

  console.log('✨ Ícones gerados com sucesso!');
}

generateIcons(); 