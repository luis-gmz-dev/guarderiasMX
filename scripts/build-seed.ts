import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { filasDesdeLibro } from '../src/services/excel.service.ts'
import type { Guarderia } from '../src/types/guarderia.ts'

const ORIGEN = 'https://www.imss.gob.mx/sites/all/statics/pdf/guarderias/'

function excelEnData(): string {
  const archivos = readdirSync('data')
    .filter((nombre) => /^directorio-guarderias-\d{4}\.xlsx$/.test(nombre))
    .sort()
  const ultimo = archivos.at(-1)
  if (!ultimo) throw new Error('No hay un Excel del directorio en data/.')
  return `data/${ultimo}`
}

function fechaMexico(fecha = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha)
}

interface DirectorioJson {
  actualizado?: string
  fuente?: string
  filas?: Guarderia[]
}

function directorioAnterior(): DirectorioJson | null {
  try {
    const data = JSON.parse(readFileSync('public/datos/guarderias.json', 'utf8')) as unknown
    if (!data || typeof data !== 'object' || Array.isArray(data)) return null
    return data as DirectorioJson
  } catch {
    return null
  }
}

const archivo = excelEnData()
const fuente = `${ORIGEN}${archivo.split(/[/\\]/).pop()}`
const { filas } = filasDesdeLibro(readFileSync(archivo))
const anterior = directorioAnterior()
const mismasFilas = JSON.stringify(anterior?.filas ?? null) === JSON.stringify(filas)
const actualizado = mismasFilas && anterior?.actualizado ? anterior.actualizado : fechaMexico()

mkdirSync('public/datos', { recursive: true })
writeFileSync(
  'public/datos/guarderias.json',
  JSON.stringify({ actualizado, fuente, filas }),
)
console.log(`Directorio con ${filas.length} guarderías. Actualizado el ${actualizado}.`)
