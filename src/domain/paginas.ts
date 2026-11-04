import type { Guarderia } from '../types/guarderia'
import { guias } from './guias'
import {
  agruparEstados,
  municipiosPublicos,
  type EstadoResumen,
  type MunicipioResumen,
} from './lugares'
import { sitio } from './sitio'

export interface MetaPagina {
  path: string
  titulo: string
  descripcion: string
}

export const paginasFijas: MetaPagina[] = [
  {
    path: '/',
    titulo: sitio.nombre,
    descripcion: sitio.descripcion,
  },
  {
    path: '/preguntas-frecuentes',
    titulo: 'Preguntas frecuentes',
    descripcion:
      'De dónde salen los datos, cómo buscar una guardería, qué pasa con tu ubicación y por qué hay anuncios. No es un sitio del IMSS.',
  },
  {
    path: '/aviso-legal',
    titulo: 'Aviso legal',
    descripcion:
      'Este mapa no pertenece al IMSS. Los datos salen de su directorio público y pueden cambiar.',
  },
  {
    path: '/privacidad',
    titulo: 'Privacidad',
    descripcion:
      'No hay cuentas. La ubicación se queda en el navegador. Los anuncios los sirve Google AdSense.',
  },
  {
    path: '/guias',
    titulo: 'Guías de guarderías del IMSS',
    descripcion:
      'Derecho, documentos, cupo, horario, cómo leer el Excel y qué hacer si un dato no coincide. Cada guía cita su fuente. No es un sitio del IMSS.',
  },
  {
    path: '/estados',
    titulo: 'Guarderías del IMSS por estado',
    descripcion: 'Lista de entidades con unidades en el directorio público. Abre un estado y pasa al mapa.',
  },
  ...guias.map((guia) => ({
    path: `/guias/${guia.slug}`,
    titulo: guia.titulo,
    descripcion: guia.descripcion,
  })),
]

export function metaEstado(estado: EstadoResumen): MetaPagina {
  return {
    path: `/estados/${estado.slug}`,
    titulo: `Guarderías del IMSS en ${estado.etiqueta}`,
    descripcion: `${estado.total} unidades del directorio público en ${estado.etiqueta}. No es un sitio del IMSS.`,
  }
}

export function metaMunicipio(municipio: MunicipioResumen): MetaPagina {
  return {
    path: `/municipios/${municipio.estadoSlug}/${municipio.slug}`,
    titulo: `Guarderías del IMSS en ${municipio.etiqueta}, ${municipio.estadoEtiqueta}`,
    descripcion: `${municipio.total} unidades en ${municipio.etiqueta}. Horario, colonia y teléfono del directorio público.`,
  }
}

export function paginasDeLugares(guarderias: Guarderia[]): MetaPagina[] {
  const estados = agruparEstados(guarderias)
  const municipios = municipiosPublicos(estados)
  return [...estados.map(metaEstado), ...municipios.map(metaMunicipio)]
}

export function paginasIndice(guarderias: Guarderia[] = []): MetaPagina[] {
  return [...paginasFijas, ...paginasDeLugares(guarderias)]
}

export function buscarPagina(path: string, guarderias: Guarderia[] = []): MetaPagina | undefined {
  return paginasIndice(guarderias).find((item) => item.path === path)
}
