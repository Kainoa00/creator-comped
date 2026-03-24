/**
 * Generates branded placeholder PNG files for public/og-image.png and public/logo.png.
 * Replace these with final designed assets before launch.
 *
 * Uses pure Node.js — no additional dependencies required.
 * Run: node scripts/generate-placeholder-images.mjs
 */

import { writeFileSync } from 'fs'
import { deflateSync } from 'zlib'

// CRC32 table
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c
}
function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crcInput = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(crcInput))
  return Buffer.concat([len, typeBytes, data, crcBuf])
}

/**
 * Creates a minimal valid PNG.
 * @param {number} width
 * @param {number} height
 * @param {[number,number,number]} bgRGB   — background color
 * @param {[number,number,number]} accentRGB — accent color (drawn as a center band)
 */
function makePNG(width, height, bgRGB, accentRGB) {
  const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 2  // RGB color type

  // Raw image data (filter byte 0 per row + RGB pixels)
  const rowBytes = 1 + width * 3
  const raw = Buffer.alloc(height * rowBytes, 0)

  const bandTop = Math.floor(height * 0.4)
  const bandBot = Math.floor(height * 0.6)

  for (let y = 0; y < height; y++) {
    const rowOff = y * rowBytes
    raw[rowOff] = 0  // filter: None
    const [r, g, b] = y >= bandTop && y < bandBot ? accentRGB : bgRGB
    for (let x = 0; x < width; x++) {
      raw[rowOff + 1 + x * 3] = r
      raw[rowOff + 1 + x * 3 + 1] = g
      raw[rowOff + 1 + x * 3 + 2] = b
    }
  }

  const idat = deflateSync(raw)

  return Buffer.concat([
    PNG_SIG,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// HIVE brand colors: #0a0a0a bg, #FF6B35 orange accent
const BG = [10, 10, 10]
const ACCENT = [255, 107, 53]

// og-image.png — 1200×630
writeFileSync('public/og-image.png', makePNG(1200, 630, BG, ACCENT))
console.log('✓ public/og-image.png (1200×630 placeholder)')

// logo.png — 512×512
writeFileSync('public/logo.png', makePNG(512, 512, BG, ACCENT))
console.log('✓ public/logo.png (512×512 placeholder)')

console.log('')
console.log('Replace these placeholders with final branded assets before launch.')
