import type { Guarderia } from '../types/guarderia'
import { buscarPagina, paginasFijas, type MetaPagina } from './paginas'
import { preguntas } from './preguntas'
import { sitio } from './sitio'

export type { MetaPagina }
export { paginasFijas as paginasIndice }

let directorioSeo: Guarderia[] = []

export function fijarDirectorioSeo(guarderias: Guarderia[]): void {
  directorioSeo = guarderias
}

export function urlCanonica(path: string): string {
  if (path === '/') return `${sitio.url}/`
  return `${sitio.url}${path}`
}

export function tituloDocumento(titulo: string): string {
  if (titulo === sitio.nombre) return sitio.nombre
  return `${titulo} · ${sitio.nombre}`
}

function paginaDe(path: string, extra?: Partial<MetaPagina>): MetaPagina | undefined {
  if (extra?.titulo && extra.descripcion) {
    return { path, titulo: extra.titulo, descripcion: extra.descripcion }
  }
  return buscarPagina(path, directorioSeo) ?? paginasFijas.find((item) => item.path === path)
}

export function datosEstructurados(path: string, extra?: Partial<MetaPagina>): Record<string, unknown> {
  const pagina = paginaDe(path, extra)
  const titulo = tituloDocumento(pagina?.titulo ?? sitio.nombre)
  const descripcion = pagina?.descripcion ?? sitio.descripcion
  if (path === '/preguntas-frecuentes') {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      url: urlCanonica(path),
      mainEntity: preguntas.map((item) => ({
        '@type': 'Question',
        name: item.pregunta,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.respuesta,
        },
      })),
    }
  }
  if (path === '/') {
    const secciones = [
      { nombre: 'Mapa de guarderías', path: '/mapa' },
      { nombre: 'Dónde están las guarderías del IMSS', path: '/estados' },
      { nombre: 'Horarios de las guarderías del IMSS', path: '/guias/costo-y-horario' },
      { nombre: 'Cómo leer el directorio', path: '/guias/como-leer-el-directorio' },
      { nombre: 'Cómo buscar', path: '/guias/como-usar-el-mapa' },
      { nombre: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
    ]
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: sitio.nombre,
          url: urlCanonica('/'),
          description: descripcion,
          inLanguage: 'es-MX',
        },
        {
          '@type': 'ItemList',
          name: 'Secciones del directorio',
          itemListElement: secciones.map((seccion, indice) => ({
            '@type': 'ListItem',
            position: indice + 1,
            name: seccion.nombre,
            url: urlCanonica(seccion.path),
          })),
        },
      ],
    }
  }
  const migas = migasDe(path, pagina)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: titulo,
        description: descripcion,
        url: urlCanonica(path),
        inLanguage: 'es-MX',
        isPartOf: {
          '@type': 'WebSite',
          name: sitio.nombre,
          url: urlCanonica('/'),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: migas.map((miga, indice) => ({
          '@type': 'ListItem',
          position: indice + 1,
          name: miga.nombre,
          item: urlCanonica(miga.path),
        })),
      },
    ],
  }
}

function migasDe(path: string, pagina?: MetaPagina): { path: string; nombre: string }[] {
  const inicio = [{ path: '/', nombre: sitio.nombre }]
  if (path === '/') return inicio
  if (path.startsWith('/guias/')) {
    return [...inicio, { path: '/guias', nombre: 'Guías' }, { path, nombre: pagina?.titulo ?? 'Guía' }]
  }
  if (path.startsWith('/municipios/')) {
    const partes = path.split('/')
    const estadoSlug = partes[2] ?? ''
    return [
      ...inicio,
      { path: '/estados', nombre: 'Estados' },
      { path: `/estados/${estadoSlug}`, nombre: 'Estado' },
      { path, nombre: pagina?.titulo ?? 'Municipio' },
    ]
  }
  if (path.startsWith('/estados/') && path !== '/estados') {
    return [...inicio, { path: '/estados', nombre: 'Estados' }, { path, nombre: pagina?.titulo ?? 'Estado' }]
  }
  return [...inicio, { path, nombre: pagina?.titulo ?? 'Página' }]
}

function fijarMeta(atributo: 'name' | 'property', clave: string, contenido: string): void {
  let meta = document.head.querySelector(`meta[${atributo}="${clave}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(atributo, clave)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', contenido)
}

function fijarEnlace(rel: string, href: string): void {
  let enlace = document.head.querySelector(`link[rel="${rel}"]`)
  if (!enlace) {
    enlace = document.createElement('link')
    enlace.setAttribute('rel', rel)
    document.head.appendChild(enlace)
  }
  enlace.setAttribute('href', href)
}

export function aplicarSeo(path: string, extra?: Partial<MetaPagina>): void {
  const pagina = paginaDe(path, extra)
  const titulo = tituloDocumento(pagina?.titulo ?? sitio.nombre)
  const descripcion = pagina?.descripcion ?? sitio.descripcion
  document.title = titulo
  fijarMeta('name', 'description', descripcion)
  fijarMeta('property', 'og:title', titulo)
  fijarMeta('property', 'og:description', descripcion)
  fijarMeta('property', 'og:url', urlCanonica(pagina ? path : '/'))
  fijarMeta('property', 'og:image', `${sitio.url}/icons/icon-512.png`)
  fijarEnlace('canonical', urlCanonica(pagina ? path : '/'))
  let script = document.getElementById('datos-estructurados')
  if (!script) {
    script = document.createElement('script')
    script.id = 'datos-estructurados'
    script.setAttribute('type', 'application/ld+json')
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(datosEstructurados(pagina ? path : '/', extra))
}
