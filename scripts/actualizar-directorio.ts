import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'

const ORIGEN = 'https://www.imss.gob.mx/sites/all/statics/pdf/guarderias/directorio-guarderias-'

function anioMexico(): number {
  return Number(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', year: 'numeric' }).format(new Date()),
  )
}

function hash(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex')
}

async function descargar(anio: number): Promise<{ anio: number; bytes: Uint8Array } | null> {
  const url = `${ORIGEN}${anio}.xlsx`
  const respuesta = await fetch(url)
  if (respuesta.status === 404) return null
  if (!respuesta.ok) throw new Error(`No se pudo descargar ${url}: ${respuesta.status}`)
  return { anio, bytes: new Uint8Array(await respuesta.arrayBuffer()) }
}

const anio = anioMexico()
const descargado = (await descargar(anio)) ?? (await descargar(anio - 1))
if (!descargado) {
  throw new Error('El IMSS no publicó el directorio de este año ni del anterior.')
}

const nuevo = hash(descargado.bytes)
const existentes = readdirSync('data').filter((nombre) => /^directorio-guarderias-\d{4}\.xlsx$/.test(nombre))
const igual = existentes.some((nombre) => hash(readFileSync(`data/${nombre}`)) === nuevo)
if (igual) {
  console.log('El directorio no cambió. No hay despliegue.')
  process.exit(0)
}

const destino = `data/directorio-guarderias-${descargado.anio}.xlsx`
for (const nombre of existentes) {
  if (`data/${nombre}` !== destino) unlinkSync(`data/${nombre}`)
}
writeFileSync(destino, descargado.bytes)

const seed = spawnSync('npm', ['run', 'seed'], { stdio: 'inherit', shell: process.platform === 'win32' })
if (seed.status !== 0) process.exit(seed.status ?? 1)
console.log(`Directorio nuevo guardado en ${destino}.`)
