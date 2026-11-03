import type { Coordenadas } from '../types/guarderia'

export const MEXICO = {
  latMin: 14,
  latMax: 33,
  lngMin: -118.5,
  lngMax: -86,
} as const

export function enMexico(latitud: number, longitud: number): boolean {
  return (
    latitud >= MEXICO.latMin &&
    latitud <= MEXICO.latMax &&
    longitud >= MEXICO.lngMin &&
    longitud <= MEXICO.lngMax
  )
}

export function distanciaMetros(origen: Coordenadas, destino: Coordenadas): number {
  const tierra = 6371000
  const a1 = (origen.latitud * Math.PI) / 180
  const a2 = (destino.latitud * Math.PI) / 180
  const da = ((destino.latitud - origen.latitud) * Math.PI) / 180
  const db = ((destino.longitud - origen.longitud) * Math.PI) / 180
  const h =
    Math.sin(da / 2) ** 2 + Math.cos(a1) * Math.cos(a2) * Math.sin(db / 2) ** 2
  return 2 * tierra * Math.asin(Math.min(1, Math.sqrt(h)))
}
