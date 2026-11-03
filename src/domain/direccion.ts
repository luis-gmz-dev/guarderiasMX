import type { Guarderia } from '@/types/guarderia'

export function direccion(guarderia: Pick<
  Guarderia,
  | 'calle'
  | 'numero_exterior'
  | 'numero_interior'
  | 'colonia'
  | 'localidad'
  | 'municipio'
  | 'estado'
  | 'codigo_postal'
>): string {
  const numero = [guarderia.numero_exterior, guarderia.numero_interior].filter(Boolean).join(' ')
  return [guarderia.calle, numero, guarderia.colonia, guarderia.localidad, guarderia.municipio, guarderia.estado, guarderia.codigo_postal]
    .filter((parte): parte is string => Boolean(parte))
    .join(', ')
}

export function enlaceGoogleMaps(latitud: number, longitud: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`
}

export function telefonoMarcable(telefono: string | null): string | null {
  if (!telefono) return null
  const digitos = telefono.replace(/\D/g, '')
  if (digitos.length !== 10) return null
  return `+52${digitos}`
}
