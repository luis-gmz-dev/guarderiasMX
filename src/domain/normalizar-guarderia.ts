import { enMexico } from './geo'
import type { AdvertenciaImportacion, GuarderiaInput, ResultadoLote } from '../types/guarderia'

export const COLUMNAS_EXCEL = [
  'Clave presupuestal',
  'nombre_de_unidad',
  'horario_de_atencion',
  'teléfonos',
  'dom_calle',
  'dom_numero_ext',
  'dom_numero_int',
  'dom_estado',
  'dom_ciudad/localidad',
  'dom_municipio',
  'dom_colonia',
  'dom_codigo_postal',
  'latitude',
  'longitude',
] as const

const MESES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export class LoteInvalido extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'LoteInvalido'
  }
}

export function textoCelda(value: unknown): string | null {
  if (value == null) return null
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null
    const mes = MESES[value.getMonth()]
    if (!mes) return null
    return `${value.getDate()}-${mes}`
  }
  const text = String(value).trim()
  return text === '' ? null : text
}

export function normalizarCodigoPostal(value: unknown): string | null {
  const text = textoCelda(value)
  if (text == null) return null
  if (!/^\d+$/.test(text) || text.length > 5) {
    throw new LoteInvalido(`Código postal inválido: ${text}`)
  }
  return text.padStart(5, '0')
}

function obligatorio(value: unknown, etiqueta: string): string {
  const text = textoCelda(value)
  if (text == null) throw new LoteInvalido(`${etiqueta} vacía`)
  return text
}

function coordenada(value: unknown, etiqueta: string): number {
  const text = textoCelda(value)
  if (text == null) throw new LoteInvalido(`${etiqueta} vacía`)
  const numero = Number(text)
  if (!Number.isFinite(numero)) throw new LoteInvalido(`${etiqueta} inválida`)
  return numero
}

export function normalizarFila(
  raw: Record<string, unknown>,
  numeroFila: number,
): { input: GuarderiaInput; advertencias: string[] } {
  let clave = ''
  try {
    clave = obligatorio(raw['Clave presupuestal'], 'Clave presupuestal')
    const nombre = obligatorio(raw.nombre_de_unidad, 'Nombre')
    const latitud = coordenada(raw.latitude, 'Latitud')
    let longitud = coordenada(raw.longitude, 'Longitud')
    const advertencias: string[] = []

    if (longitud > 0 && enMexico(latitud, -longitud)) {
      longitud = -longitud
      advertencias.push('Longitud positiva corregida a negativa para ubicarla en México.')
    }

    if (!enMexico(latitud, longitud)) {
      throw new LoteInvalido('coordenadas fuera de México')
    }

    return {
      input: {
        clave_presupuestal: clave,
        nombre,
        horario_atencion: textoCelda(raw.horario_de_atencion),
        telefono: textoCelda(raw['teléfonos']),
        calle: textoCelda(raw.dom_calle),
        numero_exterior: textoCelda(raw.dom_numero_ext),
        numero_interior: textoCelda(raw.dom_numero_int),
        estado: textoCelda(raw.dom_estado),
        localidad: textoCelda(raw['dom_ciudad/localidad']),
        municipio: textoCelda(raw.dom_municipio),
        colonia: textoCelda(raw.dom_colonia),
        codigo_postal: normalizarCodigoPostal(raw.dom_codigo_postal),
        latitud,
        longitud,
      },
      advertencias,
    }
  } catch (error) {
    if (error instanceof LoteInvalido) {
      const prefijo = clave ? `Fila ${numeroFila} (${clave})` : `Fila ${numeroFila}`
      throw new LoteInvalido(`${prefijo}: ${error.message}`)
    }
    throw error
  }
}

export function normalizarLote(rows: Record<string, unknown>[]): ResultadoLote {
  if (rows.length === 0) throw new LoteInvalido('El archivo no contiene filas')

  const filas: GuarderiaInput[] = []
  const advertencias: AdvertenciaImportacion[] = []
  const vistas = new Set<string>()

  rows.forEach((row, index) => {
    const limpia: Record<string, unknown> = {}
    for (const [clave, valor] of Object.entries(row)) limpia[clave.trim()] = valor
    const fila = normalizarFila(limpia, index + 2)
    if (vistas.has(fila.input.clave_presupuestal)) {
      throw new LoteInvalido(`Clave repetida en el archivo: ${fila.input.clave_presupuestal}`)
    }
    vistas.add(fila.input.clave_presupuestal)
    filas.push(fila.input)
    for (const mensaje of fila.advertencias) {
      advertencias.push({ clave_presupuestal: fila.input.clave_presupuestal, mensaje })
    }
  })

  return { filas, advertencias }
}
