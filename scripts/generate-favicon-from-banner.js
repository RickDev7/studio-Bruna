/**
 * Gera src/app/favicon.ico a partir de public/branding-favicon-source.png
 * (logo Bruna Silva — redimensiona para 16/32/48 px com fundo creme).
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const toIco = require('to-ico')

const SOURCE = path.join(__dirname, '../public/branding-favicon-source.png')
const OUT = path.join(__dirname, '../src/app/favicon.ico')

const BG = { r: 245, g: 241, b: 236, alpha: 1 }

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Falta o ficheiro:', SOURCE)
    process.exit(1)
  }

  const sizes = [16, 32, 48]
  const buffers = await Promise.all(
    sizes.map((size) =>
      sharp(SOURCE)
        .resize(size, size, {
          fit: 'contain',
          background: BG,
          kernel: sharp.kernel.lanczos3,
        })
        .png()
        .toBuffer(),
    ),
  )

  const buf = await toIco(buffers)
  fs.writeFileSync(OUT, buf)
  console.log('OK:', OUT)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
