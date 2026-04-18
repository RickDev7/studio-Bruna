/**
 * Gera ícones em PNG a partir de public/branding-favicon-source.png
 *
 * Tudo em public/ (exceto apple-icon): o Vercel/browser serve ficheiros
 * estáticos sem passar pela rota mágica app/icon.png do Next (que por
 * vezes falha ou mostra ícone por defeito em produção).
 *
 * Saídas:
 * - public/favicon-16.png, public/favicon-32.png, public/icon.png (48)
 * - src/app/apple-icon.png (180, convenção Next)
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const SOURCE = path.join(__dirname, '../public/branding-favicon-source.png')
const OUT_APPLE = path.join(__dirname, '../src/app/apple-icon.png')
const PUBLIC_DIR = path.join(__dirname, '../public')
const OUT_ICON_PUBLIC = path.join(PUBLIC_DIR, 'icon.png')

const MASTER = 512
const APPLE = 180
const TAB_ICON = 48
const PUBLIC_SIZES = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
]

const pngOptions = {
  compressionLevel: 4,
  effort: 10,
  palette: false,
}

async function buildMaster512() {
  return sharp(SOURCE)
    .rotate()
    .resize(MASTER, MASTER, {
      fit: 'cover',
      position: 'centre',
      kernel: sharp.kernel.lanczos3,
    })
    .png(pngOptions)
    .toBuffer()
}

async function progressiveSquare(buf, target) {
  let current = buf
  let w = (await sharp(current).metadata()).width
  if (!w) throw new Error('metadata sem largura')

  while (w > target * 2) {
    const next = Math.max(target, Math.floor(w / 2))
    current = await sharp(current)
      .resize(next, next, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3,
      })
      .png({ ...pngOptions, compressionLevel: 9 })
      .toBuffer()
    w = next
  }

  if (w !== target) {
    current = await sharp(current)
      .resize(target, target, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3,
      })
      .png(pngOptions)
      .toBuffer()
  }
  return current
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Falta o ficheiro:', SOURCE)
    process.exit(1)
  }

  const master = await buildMaster512()

  const appleBuf = await progressiveSquare(master, APPLE)
  fs.writeFileSync(OUT_APPLE, appleBuf)
  console.log('OK:', OUT_APPLE, `(${APPLE} px)`)

  const tabBuf = await progressiveSquare(master, TAB_ICON)
  fs.writeFileSync(OUT_ICON_PUBLIC, tabBuf)
  console.log('OK:', OUT_ICON_PUBLIC, `(${TAB_ICON} px)`)

  for (const { size, name } of PUBLIC_SIZES) {
    const buf = await progressiveSquare(master, size)
    const file = path.join(PUBLIC_DIR, name)
    fs.writeFileSync(file, buf)
    console.log('OK:', file)
  }

  console.log('')
  console.log('URLs: /favicon.ico (rewrite→32), /favicon-16.png, /favicon-32.png, /icon.png, /apple-icon.png')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
