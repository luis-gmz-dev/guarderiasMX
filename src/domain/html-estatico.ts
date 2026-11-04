import type { Guarderia } from '../types/guarderia'
import { guias } from './guias'
import {
  agruparEstados,
  enlaceMapa,
  filtrarLugar,
  municipiosPublicos,
  nombreUnidad,
  notaEstado,
  UMBRAL_MUNICIPIO,
} from './lugares'
import { paginasFijas, paginasIndice } from './paginas'
import { preguntas } from './preguntas'
import { datosEstructurados, tituloDocumento, urlCanonica } from './seo'
import { sitio } from './sitio'

function escapeHtml(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function p(texto: string): string {
  return `<p>${escapeHtml(texto)}</p>`
}

function enlace(href: string, texto: string): string {
  return `<a href="${escapeHtml(href)}">${escapeHtml(texto)}</a>`
}

export function xmlSitemap(guarderias: Guarderia[]): string {
  const urls = paginasIndice(guarderias)
    .map((pagina) => `  <url>\n    <loc>${urlCanonica(pagina.path)}</loc>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function cuerpoHtml(path: string, guarderias: Guarderia[]): string {
  if (path === '/preguntas-frecuentes') {
    const items = preguntas
      .map(
        (item) =>
          `<article class="pregunta"><h2>${escapeHtml(item.pregunta)}</h2>${p(item.respuesta)}</article>`,
      )
      .join('')
    return `<article class="pagina-aviso"><h1>Preguntas frecuentes</h1>${p('Respuestas sobre este mapa. No es un sitio del IMSS.')}<section>${items}</section></article>`
  }
  if (path === '/guias') {
    const items = guias
      .map(
        (guia) =>
          `<li>${enlace(`/guias/${guia.slug}`, guia.titulo)}${p(guia.descripcion)}</li>`,
      )
      .join('')
    return `<article class="pagina-aviso"><h1>Guías de guarderías del IMSS</h1>${p('Texto propio para ubicar el trámite. Este mapa no es un sitio del IMSS y no inscribe a nadie.')}<ul class="lista-paginas">${items}</ul></article>`
  }
  const guia = guias.find((item) => path === `/guias/${item.slug}`)
  if (guia) {
    const bloques = guia.bloques
      .map((bloque) => {
        if (bloque.tipo === 'h2') return `<h2>${escapeHtml(bloque.texto ?? '')}</h2>`
        if (bloque.tipo === 'lista') {
          return `<ul>${(bloque.items ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        }
        return p(bloque.texto ?? '')
      })
      .join('')
    return `<article class="pagina-aviso"><p class="miga">${enlace('/guias', 'Guías')}</p><h1>${escapeHtml(guia.titulo)}</h1>${bloques}</article>`
  }
  const estados = agruparEstados(guarderias)
  if (path === '/estados') {
    const items = estados
      .map(
        (estado) =>
          `<li>${enlace(`/estados/${estado.slug}`, estado.etiqueta)}${p(`${estado.total} unidades`)}</li>`,
      )
      .join('')
    return `<article class="pagina-aviso"><h1>Guarderías del IMSS por estado</h1>${p('Unidades del directorio público. Elige un estado. Este mapa no es un sitio del IMSS.')}<ul class="lista-paginas">${items}</ul></article>`
  }
  const estado = estados.find((item) => path === `/estados/${item.slug}`)
  if (estado) {
    const nota = notaEstado(estado.estado)
    const conPagina = estado.municipios.filter((item) => item.total >= UMBRAL_MUNICIPIO)
    const lista = conPagina
      .map(
        (municipio) =>
          `<li>${enlace(`/municipios/${municipio.estadoSlug}/${municipio.slug}`, municipio.etiqueta)}${p(`${municipio.total} unidades`)}</li>`,
      )
      .join('')
    return `<article class="pagina-aviso"><p class="miga">${enlace('/estados', 'Estados')}</p><h1>Guarderías del IMSS en ${escapeHtml(estado.etiqueta)}</h1>${p(`Hay ${estado.total} unidades en esta copia del directorio.`)}${nota ? p(nota) : ''}<ul class="lista-paginas">${lista}</ul><p>${enlace(enlaceMapa(estado.estado), 'Verlas en el mapa')}</p></article>`
  }
  const municipio = municipiosPublicos(estados).find(
    (item) => path === `/municipios/${item.estadoSlug}/${item.slug}`,
  )
  if (municipio) {
    const unidades = filtrarLugar(guarderias, municipio.estado, municipio.municipio)
      .map((unidad) => {
        const detalle = [unidad.colonia, unidad.horario_atencion, unidad.telefono].filter(Boolean).join(' · ')
        return `<li><strong>${escapeHtml(nombreUnidad(unidad.nombre))}</strong><span>${escapeHtml(detalle)}</span></li>`
      })
      .join('')
    return `<article class="pagina-aviso"><p class="miga">${enlace('/estados', 'Estados')} · ${enlace(`/estados/${municipio.estadoSlug}`, municipio.estadoEtiqueta)}</p><h1>Guarderías del IMSS en ${escapeHtml(municipio.etiqueta)}</h1>${p(`${municipio.total} unidades en ${municipio.etiqueta}, ${municipio.estadoEtiqueta}.`)}<ul class="lista-unidades">${unidades}</ul><p>${enlace(enlaceMapa(municipio.estado, municipio.municipio), 'Verlas en el mapa')}</p></article>`
  }
  return ''
}

export function inyectarHtml(plantilla: string, path: string, guarderias: Guarderia[]): string {
  const pagina = paginasIndice(guarderias).find((item) => item.path === path) ?? paginasFijas[0]
  if (!pagina) return plantilla
  const titulo = escapeHtml(tituloDocumento(pagina.titulo))
  const descripcion = escapeHtml(pagina.descripcion)
  const url = urlCanonica(path)
  const json = JSON.stringify(datosEstructurados(path)).replace(/</g, '\\u003c')
  const cuerpo = cuerpoHtml(path, guarderias)
  let html = plantilla
    .replace(/<title>[^<]*<\/title>/, `<title>${titulo}</title>`)
    .replace(/<meta[^>]*name="description"[^>]*>/, `<meta name="description" content="${descripcion}">`)
    .replace(/<link[^>]*rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`)
    .replace(/<meta[^>]*property="og:url"[^>]*>/, `<meta property="og:url" content="${url}">`)
    .replace(/<meta[^>]*property="og:title"[^>]*>/, `<meta property="og:title" content="${titulo}">`)
    .replace(/<meta[^>]*property="og:description"[^>]*>/, `<meta property="og:description" content="${descripcion}">`)
  if (cuerpo) {
    html = html.replace(/<div id="app"><\/div>/, `<div id="app">${cuerpo}</div>`)
  }
  if (!html.includes('id="datos-estructurados"')) {
    html = html.replace(
      '</head>',
      `<script id="datos-estructurados" type="application/ld+json">${json}</script>\n  </head>`,
    )
  }
  return html
}

export function rutasConCuerpo(guarderias: Guarderia[]): string[] {
  return paginasIndice(guarderias)
    .map((item) => item.path)
    .filter((path) => path !== '/' && cuerpoHtml(path, guarderias))
}

export { sitio }
