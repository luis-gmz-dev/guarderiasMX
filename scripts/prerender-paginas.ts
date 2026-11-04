import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'
import { inyectarHtml, xmlSitemap } from '../src/domain/html-estatico.ts'
import { paginasIndice } from '../src/domain/paginas.ts'
import { fijarDirectorioSeo } from '../src/domain/seo.ts'
import { interpretarDirectorio } from '../src/services/directorio.ts'

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')

export function prerenderPaginas(): Plugin {
  return {
    name: 'prerender-paginas',
    apply: 'build',
    closeBundle() {
      const dist = join(raiz, 'dist')
      const bruto = JSON.parse(readFileSync(join(raiz, 'public/datos/guarderias.json'), 'utf8'))
      const directorio = interpretarDirectorio(bruto)
      fijarDirectorioSeo(directorio.guarderias)
      const plantilla = readFileSync(join(dist, 'index.html'), 'utf8')
      writeFileSync(join(dist, 'sitemap.xml'), xmlSitemap(directorio.guarderias))
      for (const pagina of paginasIndice(directorio.guarderias)) {
        if (pagina.path === '/') continue
        const html = inyectarHtml(plantilla, pagina.path, directorio.guarderias)
        const carpeta = join(dist, pagina.path)
        mkdirSync(carpeta, { recursive: true })
        writeFileSync(join(carpeta, 'index.html'), html)
      }
    },
  }
}
