/**
 * Gera ícones a partir de public/branding-favicon-source.png
 *
 * - Master quadrado 512 px (mesmo recorte para tudo): mais detalhe antes
 *   de reduzir a tamanhos minúsculos.
 * - Redimensionamento progressivo (passos ~50%): evita o “blur” de
 *   saltar 512→16 num único passo.
 * - PNG em cor verdadeira (palette: false).
 * - Saídas: apple-icon.png (180), icon.png (48, para tabs modernos),
 *   favicon.ico (várias camadas).
 */
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const toIco = require('to-ico')

const SOURCE = path.join(__dirname, '../public/branding-favicon-source.png')
const OUT_ICO = path.join(__dirname, '../src/app/favicon.ico')
const OUT_APPLE = path.join(__dirname, '../src/app/apple-icon.png')
const OUT_ICON_PNG = path.join(__dirname, '../src/app/icon.png')

const MASTER = 512
const APPLE = 180
const TAB_ICON = 48
const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]

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

/**
 * Reduz para (target x target) em passos (nunca > ~2x por passo).
 */
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
  fs.writeFileSync(OUT_ICON_PNG, tabBuf)
  console.log('OK:', OUT_ICON_PNG, `(${TAB_ICON} px, preferir em browsers)`)

  const buffers = await Promise.all(ICO_SIZES.map((size) => progressiveSquare(master, size)))
  const buf = await toIco(buffers)
  fs.writeFileSync(OUT_ICO, buf)
  console.log('OK:', OUT_ICO, `(${ICO_SIZES.join(', ')} px, master ${MASTER})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
