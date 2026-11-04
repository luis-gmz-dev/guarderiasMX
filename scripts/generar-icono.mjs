import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const VERDE = [15, 107, 76]
const CREMA = [243, 239, 230]

const tablaCrc = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
  tablaCrc[n] = c >>> 0
}

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = tablaCrc[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(tipo, datos) {
  const cuerpo = Buffer.concat([Buffer.from(tipo), datos])
  const largo = Buffer.alloc(4)
  largo.writeUInt32BE(datos.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(cuerpo))
  return Buffer.concat([largo, cuerpo, crc])
}

function png(tamano, rgba) {
  const crudo = Buffer.alloc((tamano * 4 + 1) * tamano)
  for (let y = 0; y < tamano; y++) {
    const fila = y * (tamano * 4 + 1)
    crudo[fila] = 0
    rgba.copy(crudo, fila + 1, y * tamano * 4, (y + 1) * tamano * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(tamano, 0)
  ihdr.writeUInt32BE(tamano, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  const firma = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    firma,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(crudo)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

function enTriangulo(x, y, a, b, c) {
  const area = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y)
  const ab = (b.x - a.x) * (y - a.y) - (x - a.x) * (b.y - a.y)
  const bc = (c.x - b.x) * (y - b.y) - (x - b.x) * (c.y - b.y)
  const ca = (a.x - c.x) * (y - c.y) - (x - c.x) * (a.y - c.y)
  const mismo = area < 0
  return (ab < 0) === mismo && (bc < 0) === mismo && (ca < 0) === mismo
}

function capa(x, y, tamano) {
  const cx = tamano * 0.5
  const cy = tamano * 0.4
  const radio = tamano * 0.18
  const punta = { x: cx, y: tamano * 0.8 }
  const izquierda = { x: cx - radio * 0.82, y: cy + radio * 0.2 }
  const derecha = { x: cx + radio * 0.82, y: cy + radio * 0.2 }
  const dx = x - cx
  const dy = y - cy
  const enCirculo = dx * dx + dy * dy <= radio * radio
  const enCuerpo = enTriangulo(x, y, izquierda, derecha, punta)
  if (!enCirculo && !enCuerpo) return null
  const hueco = tamano * 0.075
  if (dx * dx + dy * dy <= hueco * hueco) return VERDE
  return CREMA
}

function dibujar(tamano) {
  const rgba = Buffer.alloc(tamano * tamano * 4)
  const muestras = 3
  for (let y = 0; y < tamano; y++) {
    for (let x = 0; x < tamano; x++) {
      let cr = 0
      let cg = 0
      let cb = 0
      let n = 0
      for (let sy = 0; sy < muestras; sy++) {
        for (let sx = 0; sx < muestras; sx++) {
          const color = capa(
            x + (sx + 0.5) / muestras,
            y + (sy + 0.5) / muestras,
            tamano,
          )
          if (!color) continue
          cr += color[0]
          cg += color[1]
          cb += color[2]
          n++
        }
      }
      const i = (y * tamano + x) * 4
      const total = muestras * muestras
      const mezcla = n / total
      rgba[i] = Math.round(VERDE[0] * (1 - mezcla) + (n ? cr / n : 0) * mezcla)
      rgba[i + 1] = Math.round(VERDE[1] * (1 - mezcla) + (n ? cg / n : 0) * mezcla)
      rgba[i + 2] = Math.round(VERDE[2] * (1 - mezcla) + (n ? cb / n : 0) * mezcla)
      rgba[i + 3] = 255
    }
  }
  return rgba
}

function guardar(ruta, tamano) {
  mkdirSync(dirname(ruta), { recursive: true })
  writeFileSync(ruta, png(tamano, dibujar(tamano)))
}

guardar('public/icons/icon-192.png', 192)
guardar('public/icons/icon-512.png', 512)
guardar('public/icons/apple-touch-icon.png', 180)
