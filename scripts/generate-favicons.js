const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '../public/images/logo.png.jpg');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
  try {
    // Gerar favicon.png (16x16)
    await sharp(inputImage)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'favicon.png'));

    // Gerar apple-touch-icon.png (180x180)
    await sharp(inputImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));

    // Gerar android-chrome-192x192.png
    await sharp(inputImage)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'android-chrome-192x192.png'));

    // Gerar android-chrome-512x512.png
    await sharp(inputImage)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'android-chrome-512x512.png'));

    // Gerar og-image.png (1200x630)
    await sharp(inputImage)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFormat('png')
      .toFile(path.join(outputDir, 'og-image.png'));

    console.log('Favicons gerados com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar favicons:', error);
  }
}

generateFavicons(); 