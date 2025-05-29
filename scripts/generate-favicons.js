const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/logo.svg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Gerar favicon.ico (32x32)
    await sharp(inputImage)
      .resize(32, 32)
      .toFile(path.join(outputDir, 'favicon.ico'));

    // Gerar apple-icon.png (180x180)
    await sharp(inputImage)
      .resize(180, 180)
      .toFile(path.join(outputDir, 'apple-icon.png'));

    // Gerar og-image.png (1200x630)
    await sharp(inputImage)
      .resize(1200, 630)
      .toFile(path.join(outputDir, 'og-image.png'));

    console.log('Favicons gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar favicons:', error);
  }
}

generateFavicons(); 