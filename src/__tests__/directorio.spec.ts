import { describe, expect, it } from 'vitest'
import { etiquetaActualizacion } from '@/domain/actualizacion'
import { interpretarDirectorio } from '@/services/directorio'
import type { GuarderiaInput } from '@/types/guarderia'

function fila(clave: string): GuarderiaInput {
  return {
    clave_presupuestal: clave,
    nombre: 'Unidad',
    horario_atencion: null,
    telefono: null,
    calle: null,
    numero_exterior: null,
    numero_interior: null,
    estado: 'JALISCO',
    localidad: null,
    municipio: 'GUADALAJARA',
    colonia: null,
    codigo_postal: '44100',
    latitud: 20.67,
    longitud: -103.35,
  }
}

describe('directorio publicado', () => {
  it('lee la fecha y las filas del JSON', () => {
    const directorio = interpretarDirectorio({
      actualizado: '2026-11-03',
      fuente: 'https://www.imss.gob.mx/sites/all/statics/pdf/guarderias/directorio-guarderias-2026.xlsx',
      filas: [fila('056B01')],
    })
    expect(directorio.actualizado).toBe('2026-11-03')
    expect(directorio.guarderias[0]?.clave_presupuestal).toBe('056B01')
  })

  it('acepta un arreglo suelto sin fecha', () => {
    const directorio = interpretarDirectorio([fila('100')])
    expect(directorio.actualizado).toBeNull()
    expect(directorio.guarderias).toHaveLength(1)
  })

  it('rechaza un archivo sin filas', () => {
    expect(() => interpretarDirectorio({ filas: [{ nombre: 'Incompleta' }] })).toThrow(/formato/)
  })
})

describe('etiqueta de actualización', () => {
  it('escribe la fecha en español', () => {
    expect(etiquetaActualizacion('2026-11-03')).toBe('Actualizado el 3 de noviembre de 2026')
  })

  it('no muestra etiqueta si no hay fecha', () => {
    expect(etiquetaActualizacion(null)).toBeNull()
    expect(etiquetaActualizacion('ayer')).toBeNull()
  })
})
