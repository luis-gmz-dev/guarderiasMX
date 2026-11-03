import { describe, expect, it } from 'vitest'
import { coincide } from '@/domain/texto-busqueda'

describe('búsqueda sin acentos', () => {
  it('encuentra un nombre aunque falten los acentos', () => {
    expect(coincide('MICHOACÁN', 'michoacan')).toBe(true)
    expect(coincide('JALISCO', 'oax')).toBe(false)
  })
})
