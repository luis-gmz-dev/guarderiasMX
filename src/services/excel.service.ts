import * as XLSX from 'xlsx'
import { COLUMNAS_EXCEL, LoteInvalido, normalizarLote } from '../domain/normalizar-guarderia'
import type { ResultadoLote } from '../types/guarderia'

function bytes(data: ArrayBuffer | Uint8Array): ArrayBuffer {
  if (data instanceof ArrayBuffer) return data
  const copia = new ArrayBuffer(data.byteLength)
  new Uint8Array(copia).set(data)
  return copia
}

function hoja(data: ArrayBuffer | Uint8Array): XLSX.WorkSheet {
  const libro = XLSX.read(bytes(data), { type: 'array' })
  const nombre = libro.SheetNames[0]
  if (!nombre) throw new LoteInvalido('El archivo no tiene hojas')
  const sheet = libro.Sheets[nombre]
  if (!sheet) throw new LoteInvalido('El archivo no tiene hojas')
  return sheet
}

export function filasDesdeLibro(data: ArrayBuffer | Uint8Array): ResultadoLote {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja(data), {
    raw: false,
    defval: null,
  })
  if (rows.length === 0) throw new LoteInvalido('El archivo no contiene filas')

  const primera = rows[0]
  if (!primera) throw new LoteInvalido('El archivo no contiene filas')
  const claves = new Set(Object.keys(primera).map((clave) => clave.trim()))
  for (const columna of COLUMNAS_EXCEL) {
    if (!claves.has(columna)) throw new LoteInvalido(`Falta la columna ${columna}`)
  }

  return normalizarLote(rows)
}

export async function leerExcel(file: File): Promise<ResultadoLote> {
  return filasDesdeLibro(await file.arrayBuffer())
}
