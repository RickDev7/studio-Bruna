const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputImage = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Gerar PNG temporário em alta resolução
    await sharp(inputImage)
      .resize(512, 512)
      .png()
      .toFile(path.join(outputDir, 'temp-high-res.png'));

    // Gerar favicon.ico usando o PNG temporário
    await sharp(path.join(outputDir, 'temp-high-res.png'))
      .resize(32, 32)
      .png()
      .toFile(path.join(outputDir, 'favicon-32.png'));

    await sharp(path.join(outputDir, 'temp-high-res.png'))
      .resize(16, 16)
      .png()
      .toFile(path.join(outputDir, 'favicon-16.png'));

    // Gerar apple-icon.png (180x180)
    await sharp(inputImage)
      .resize(180, 180)
      .png()
      .toFile(path.join(outputDir, 'apple-icon.png'));

    // Gerar og-image.png (1200x630)
    await sharp(inputImage)
      .resize(1200, 630)
      .png()
      .toFile(path.join(outputDir, 'og-image.png'));

    // Instalar o pacote ico-converter globalmente se necessário
    try {
      execSync('npm list -g png-to-ico', { stdio: 'ignore' });
    } catch {
      console.log('Instalando png-to-ico...');
      execSync('npm install -g png-to-ico');
    }

    // Converter PNGs para ICO
    execSync('png-to-ico public/favicon-32.png > public/favicon.ico');

    // Limpar arquivos temporários
    fs.unlinkSync(path.join(outputDir, 'temp-high-res.png'));
    fs.unlinkSync(path.join(outputDir, 'favicon-32.png'));
    fs.unlinkSync(path.join(outputDir, 'favicon-16.png'));

    console.log('Favicons gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar favicons:', error);
  }
}

generateFavicons(); 