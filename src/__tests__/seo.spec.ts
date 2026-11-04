import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { guias } from '@/domain/guias'
import { cuerpoHtml, xmlSitemap } from '@/domain/html-estatico'
import { agruparEstados, municipiosPublicos, slugLugar, UMBRAL_MUNICIPIO } from '@/domain/lugares'
import { paginasFijas, paginasIndice } from '@/domain/paginas'
import { preguntas } from '@/domain/preguntas'
import { datosEstructurados, fijarDirectorioSeo, tituloDocumento, urlCanonica } from '@/domain/seo'
import { sitio } from '@/domain/sitio'
import { interpretarDirectorio } from '@/services/directorio'

const directorio = interpretarDirectorio(
  JSON.parse(readFileSync('public/datos/guarderias.json', 'utf8')),
)
fijarDirectorioSeo(directorio.guarderias)

describe('paginas indexables', () => {
  it('arma el titulo y la url canonica', () => {
    expect(tituloDocumento(sitio.nombre)).toBe('Mapa de guarderías')
    expect(tituloDocumento('Preguntas frecuentes')).toBe('Preguntas frecuentes · Mapa de guarderías')
    expect(urlCanonica('/')).toBe('https://guarderiasmx.g-corp.site/')
    expect(urlCanonica('/preguntas-frecuentes')).toBe('https://guarderiasmx.g-corp.site/preguntas-frecuentes')
  })

  it('publica las mismas preguntas en la pagina y en el esquema', () => {
    const datos = datosEstructurados('/preguntas-frecuentes')
    const entidades = datos.mainEntity as { name: string, acceptedAnswer: { text: string } }[]
    expect(entidades.map((item) => item.name)).toEqual(preguntas.map((item) => item.pregunta))
    expect(entidades.map((item) => item.acceptedAnswer.text)).toEqual(preguntas.map((item) => item.respuesta))
  })

  it('lista cada pagina publica en el sitemap generado', () => {
    const sitemap = xmlSitemap(directorio.guarderias)
    for (const pagina of paginasIndice(directorio.guarderias)) {
      expect(sitemap).toContain(`<loc>${urlCanonica(pagina.path)}</loc>`)
    }
  })

  it('incluye el script de AdSense en el html que comparten todas las rutas', () => {
    const html = readFileSync('index.html', 'utf8')
    expect(html).toContain(`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${sitio.adsense}`)
    expect(html).toContain('crossorigin="anonymous"')
    expect(html).toContain(`content="${sitio.adsense}"`)
  })
})

describe('guias y lugares', () => {
  it('tiene texto en cada guia y slugs unicos', () => {
    const slugs = guias.map((guia) => guia.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const guia of guias) {
      expect(guia.titulo.length).toBeGreaterThan(10)
      expect(guia.descripcion.length).toBeGreaterThan(20)
      expect(guia.bloques.length).toBeGreaterThan(0)
      expect(cuerpoHtml(`/guias/${guia.slug}`, directorio.guarderias)).toContain(guia.titulo)
    }
  })

  it('agrupa estados con slugs unicos y solo publica municipios con cinco o mas unidades', () => {
    const estados = agruparEstados(directorio.guarderias)
    expect(estados.length).toBeGreaterThan(20)
    expect(new Set(estados.map((item) => item.slug)).size).toBe(estados.length)
    const municipios = municipiosPublicos(estados)
    expect(municipios.every((item) => item.total >= UMBRAL_MUNICIPIO)).toBe(true)
    expect(municipios.length).toBeGreaterThan(50)
    expect(new Set(municipios.map((item) => `${item.estadoSlug}/${item.slug}`)).size).toBe(municipios.length)
    expect(estados.some((item) => item.slug === slugLugar('Jalisco'))).toBe(true)
  })

  it('incluye las guias fijas entre las paginas del indice', () => {
    const rutas = paginasFijas.map((item) => item.path)
    expect(rutas).toContain('/guias')
    expect(rutas).toContain('/estados')
    expect(rutas).toContain('/guias/quien-tiene-derecho')
  })
})
