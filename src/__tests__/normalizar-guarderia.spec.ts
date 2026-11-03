import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { LoteInvalido, normalizarLote, textoCelda } from '@/domain/normalizar-guarderia'
import { filasDesdeLibro } from '@/services/excel.service'

function fila(extra: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    'Clave presupuestal': '16701',
    nombre_de_unidad: 'Unidad de prueba',
    horario_de_atencion: '07:00-16:00',
    teléfonos: '4499753593',
    dom_calle: 'CALLE',
    dom_numero_ext: '1',
    dom_numero_int: null,
    dom_estado: 'AGUASCALIENTES',
    'dom_ciudad/localidad': 'AGUASCALIENTES',
    dom_municipio: 'AGUASCALIENTES',
    dom_colonia: 'CENTRO',
    dom_codigo_postal: '20180',
    latitude: '21.89',
    longitude: '-102.27',
    ...extra,
  }
}

describe('normalizar guarderías', () => {
  it('rellena el código postal a 5 dígitos', () => {
    const { filas } = normalizarLote([fila({ dom_codigo_postal: 1170 })])
    expect(filas[0]?.codigo_postal).toBe('01170')
  })

  it('invierte la longitud positiva de Torreón', () => {
    const { filas, advertencias } = normalizarLote([
      fila({
        'Clave presupuestal': '056B01',
        latitude: 25.56771,
        longitude: 103.42743,
      }),
    ])
    expect(filas[0]?.longitud).toBeCloseTo(-103.42743)
    expect(advertencias).toHaveLength(1)
  })

  it('conserva un teléfono con varios números', () => {
    const telefono = '5555500108 - 5556162449 - 5556160021'
    const { filas } = normalizarLote([fila({ teléfonos: telefono })])
    expect(filas[0]?.telefono).toBe(telefono)
  })

  it('escribe una fecha de Excel como texto y no como Date', () => {
    expect(textoCelda(new Date(2026, 3, 1))).toBe('1-Apr')
  })

  it('aborta el lote completo si la clave se repite', () => {
    expect(() => normalizarLote([fila(), fila()])).toThrow(LoteInvalido)
  })

  it('aborta si la coordenada queda fuera de México', () => {
    expect(() => normalizarLote([fila({ latitude: 48.8, longitude: 2.3 })])).toThrow(/fuera de México/)
  })
})

describe('directorio 2026', () => {
  it('normaliza las 1262 guarderías del Excel', () => {
    const buffer = readFileSync('data/directorio-guarderias-2026.xlsx')
    const { filas, advertencias } = filasDesdeLibro(buffer)
    expect(filas).toHaveLength(1262)
    expect(filas.find((item) => item.clave_presupuestal === '056B01')?.longitud).toBeLessThan(0)
    expect(advertencias.map((item) => item.clave_presupuestal)).toEqual(['056B01'])
    expect(filas.find((item) => item.clave_presupuestal === '376204')?.codigo_postal).toBe('01170')
    expect(filas.find((item) => item.clave_presupuestal === '376506')?.telefono).toContain('5555500108')
    expect(filas.find((item) => item.clave_presupuestal === '166528')?.numero_interior).toBe('1-Apr')
    expect(filas.find((item) => item.clave_presupuestal === '016B01')).toBeTruthy()
  })
})
