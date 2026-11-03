import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { filasDesdeLibro } from '../src/services/excel.service.ts'
import type { GuarderiaInput } from '../src/types/guarderia.ts'

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

function sql(value: string | null): string {
  if (value == null) return 'null'
  return `'${value.replaceAll("'", "''")}'`
}

function valores(fila: GuarderiaInput): string {
  return `  (${[
    sql(fila.clave_presupuestal),
    sql(fila.nombre),
    sql(fila.horario_atencion),
    sql(fila.telefono),
    sql(fila.calle),
    sql(fila.numero_exterior),
    sql(fila.numero_interior),
    sql(fila.estado),
    sql(fila.localidad),
    sql(fila.municipio),
    sql(fila.colonia),
    sql(fila.codigo_postal),
    String(fila.latitud),
    String(fila.longitud),
  ].join(', ')})`
}

interface DirectorioJson {
  actualizado?: string
  fuente?: string
  filas?: GuarderiaInput[]
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

const sqlText = `-- Generado desde ${archivo}. Regenerar con npm run seed.
-- La clave 056B01 se guarda con longitud negativa.
insert into public.guarderias (
  clave_presupuestal,
  nombre,
  horario_atencion,
  telefono,
  calle,
  numero_exterior,
  numero_interior,
  estado,
  localidad,
  municipio,
  colonia,
  codigo_postal,
  latitud,
  longitud
) values
${filas.map(valores).join(',\n')}
on conflict (clave_presupuestal) do update set
  nombre = excluded.nombre,
  horario_atencion = excluded.horario_atencion,
  telefono = excluded.telefono,
  calle = excluded.calle,
  numero_exterior = excluded.numero_exterior,
  numero_interior = excluded.numero_interior,
  estado = excluded.estado,
  localidad = excluded.localidad,
  municipio = excluded.municipio,
  colonia = excluded.colonia,
  codigo_postal = excluded.codigo_postal,
  latitud = excluded.latitud,
  longitud = excluded.longitud;
`

writeFileSync('supabase/seed.sql', sqlText)
mkdirSync('public/datos', { recursive: true })
writeFileSync(
  'public/datos/guarderias.json',
  JSON.stringify({ actualizado, fuente, filas }),
)
console.log(`Directorio con ${filas.length} guarderías. Actualizado el ${actualizado}.`)
