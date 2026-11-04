import type { Guarderia, GuarderiaInput } from '../types/guarderia'

export interface DirectorioPublicado {
  actualizado: string | null
  fuente: string | null
  guarderias: Guarderia[]
}

function esFila(value: unknown): value is GuarderiaInput {
  if (!value || typeof value !== 'object') return false
  const fila = value as Partial<GuarderiaInput>
  return typeof fila.clave_presupuestal === 'string' && typeof fila.nombre === 'string' && typeof fila.latitud === 'number'
}

export function interpretarDirectorio(data: unknown): DirectorioPublicado {
  const objeto =
    data && typeof data === 'object' && !Array.isArray(data)
      ? (data as { actualizado?: unknown; fuente?: unknown; filas?: unknown })
      : null
  const crudas = Array.isArray(data) ? data : objeto && Array.isArray(objeto.filas) ? objeto.filas : null
  if (!crudas || crudas.some((fila) => !esFila(fila))) {
    throw new Error('El directorio no tiene el formato esperado.')
  }
  const filas = crudas as GuarderiaInput[]

  return {
    actualizado: typeof objeto?.actualizado === 'string' ? objeto.actualizado : null,
    fuente: typeof objeto?.fuente === 'string' ? objeto.fuente : null,
    guarderias: filas,
  }
}

export async function leerDirectorio(): Promise<DirectorioPublicado> {
  const respuesta = await fetch('/datos/guarderias.json', { cache: 'no-cache' })
  if (!respuesta.ok) throw new Error('No se pudo leer el directorio.')
  return interpretarDirectorio(await respuesta.json())
}
