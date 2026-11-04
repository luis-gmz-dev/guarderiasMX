import type { Guarderia } from '../types/guarderia'
import { textoBusqueda } from './texto-busqueda'

export const UMBRAL_MUNICIPIO = 5

export interface EstadoResumen {
  estado: string
  slug: string
  etiqueta: string
  total: number
  municipios: MunicipioResumen[]
}

export interface MunicipioResumen {
  estado: string
  estadoSlug: string
  estadoEtiqueta: string
  municipio: string
  slug: string
  etiqueta: string
  total: number
}

const TITULOS_FIJOS = new Set(['Ciudad de México', 'Estado de México'])

export function slugLugar(texto: string): string {
  return textoBusqueda(texto)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function nombreVisible(texto: string): string {
  if (TITULOS_FIJOS.has(texto)) return texto
  return texto.toLocaleLowerCase('es-MX').replace(/(^|[\s'/.-])(\p{L})/gu, (_, sep: string, letra: string) => {
    return `${sep}${letra.toLocaleUpperCase('es-MX')}`
  })
}

export function notaEstado(estado: string): string | null {
  if (slugLugar(estado) !== 'baja-california') return null
  return 'En el Excel oficial, La Paz aparece en Baja California. No hay un estado aparte llamado Baja California Sur en esta copia del directorio.'
}

export function agruparEstados(guarderias: Guarderia[]): EstadoResumen[] {
  const porEstado = new Map<string, Guarderia[]>()
  for (const item of guarderias) {
    if (!item.estado) continue
    const lista = porEstado.get(item.estado) ?? []
    lista.push(item)
    porEstado.set(item.estado, lista)
  }
  return [...porEstado.entries()]
    .map(([estado, lista]) => {
      const municipios = agruparMunicipios(estado, lista)
      return {
        estado,
        slug: slugLugar(estado),
        etiqueta: nombreVisible(estado),
        total: lista.length,
        municipios,
      }
    })
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es-MX'))
}

function agruparMunicipios(estado: string, lista: Guarderia[]): MunicipioResumen[] {
  const porMunicipio = new Map<string, number>()
  for (const item of lista) {
    if (!item.municipio) continue
    porMunicipio.set(item.municipio, (porMunicipio.get(item.municipio) ?? 0) + 1)
  }
  return [...porMunicipio.entries()]
    .map(([municipio, total]) => ({
      estado,
      estadoSlug: slugLugar(estado),
      estadoEtiqueta: nombreVisible(estado),
      municipio,
      slug: slugLugar(municipio),
      etiqueta: nombreVisible(municipio),
      total,
    }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es-MX'))
}

export function municipiosPublicos(estados: EstadoResumen[]): MunicipioResumen[] {
  return estados.flatMap((estado) => estado.municipios.filter((item) => item.total >= UMBRAL_MUNICIPIO))
}

export function buscarEstado(estados: EstadoResumen[], slug: string): EstadoResumen | undefined {
  return estados.find((item) => item.slug === slug)
}

export function buscarMunicipio(
  estados: EstadoResumen[],
  estadoSlug: string,
  municipioSlug: string,
): MunicipioResumen | undefined {
  const estado = buscarEstado(estados, estadoSlug)
  return estado?.municipios.find((item) => item.slug === municipioSlug && item.total >= UMBRAL_MUNICIPIO)
}

export function filtrarLugar(guarderias: Guarderia[], estado: string, municipio?: string): Guarderia[] {
  return guarderias
    .filter((item) => item.estado === estado && (!municipio || item.municipio === municipio))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es-MX'))
}

export function enlaceMapa(estado: string, municipio?: string): string {
  const params = new URLSearchParams({ estado })
  if (municipio) params.set('municipio', municipio)
  return `/mapa?${params.toString()}`
}

export function nombreUnidad(nombre: string): string {
  return nombre.replace(/^[A-Z]-[\d]+\s+/, '').trim() || nombre.trim()
}
