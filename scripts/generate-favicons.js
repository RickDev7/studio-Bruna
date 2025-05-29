const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Remover favicon existente se houver
    const faviconPath = path.join(outputDir, 'favicon.ico');
    if (fs.existsSync(faviconPath)) {
      fs.unlinkSync(faviconPath);
    }

    // Gerar favicon.ico (32x32)
    await sharp(inputImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'favicon.png'));

    // Renomear para .ico
    fs.renameSync(
      path.join(outputDir, 'favicon.png'),
      path.join(outputDir, 'favicon.ico')
    );

    // Gerar apple-icon.png (180x180)
    await sharp(inputImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'apple-icon.png'));

    // Gerar og-image.png (1200x630)
    await sharp(inputImage)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, 'og-image.png'));

    console.log('Favicons gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar favicons:', error);
  }
}

generateFavicons(); 