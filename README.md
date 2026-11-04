# Mapa de guarderías

Sitio de consulta. Muestra el directorio público de guarderías del IMSS en un mapa. No tiene administración, inicio de sesión ni carga de archivos.

Los datos salen de `public/datos/guarderias.json`. Ese archivo trae la fecha de la última actualización, la dirección del Excel oficial y las guarderías. El mapa muestra esa fecha, por ejemplo `Actualizado el 3 de noviembre de 2026`.

```
npm install
npm run dev
```

Abre http://localhost:5173/.

## Actualización automática

El IMSS publica el directorio en una dirección fija, con el año en el nombre:

`https://www.imss.gob.mx/sites/all/statics/pdf/guarderias/directorio-guarderias-2026.xlsx`

La acción `.github/workflows/directorio.yml` corre cada lunes a las 8:00, hora de México. También se puede lanzar a mano en GitHub, en **Actions**, **Directorio**, **Run workflow**.

- Prueba el Excel del año en curso. Si responde 404, prueba el año anterior.
- Lo compara con el archivo que ya está en `data/`. Si es el mismo, termina y no hay despliegue.
- Si cambió, guarda el Excel, regenera el JSON con `npm run seed` y sube el cambio a `main`.
- Ese commit no vuelve a disparar la acción. Cloudflare Pages, conectado a `main`, publica el mapa.

Hace falta el repositorio en GitHub y Pages conectado a `main`. Si el IMSS cambia la ruta o las columnas, la acción falla y el sitio se queda con el último directorio válido.

## Actualizar a mano

Sustituye el Excel en `data/` por el archivo nuevo, con el nombre `directorio-guarderias-AAAA.xlsx`, y súbelo a `main`. El build regenera el JSON desde ese Excel.

Si ya generaste el JSON, también puedes sustituir `public/datos/guarderias.json`. Tiene que incluir `actualizado` (`AAAA-MM-DD`), `fuente` y `filas`. En el build de Pages ese JSON se vuelve a generar desde el Excel del mismo commit, así que el Excel y el JSON deben corresponder al mismo directorio.

Para regenerarlo en tu computadora:

```
npm run seed
```

## Publicar en Cloudflare Pages

1. Crea un repositorio en GitHub y sube esta carpeta a la rama `main`.
2. Entra a Cloudflare. Abre **Workers & Pages**, pulsa **Create** y elige **Pages**. Después **Connect to Git** y selecciona el repositorio.
3. En la configuración del build usa:
   - Framework preset: Vue
   - Build command: `npm run seed && npm run build`
   - Build output directory: `dist`
   - Production branch: `main`
   - Variable de entorno: `NODE_VERSION` = `22`
4. No agregues `NODE_ENV` con el valor `production`. El comando `npm run seed` usa `tsx`, y esa variable haría que no se instale.
5. Guarda y espera el primer despliegue. Cloudflare te da una dirección que termina en `.pages.dev`. Ábrela y comprueba el mapa, el aviso legal y la privacidad.
6. En el proyecto de Pages abre **Custom domains** y agrega `guarderias.g-corp.site`. Si el DNS de `g-corp.site` ya está en Cloudflare, Pages crea el registro. Si el DNS está en otro lugar, crea un CNAME: el nombre `guarderias` apunta al dominio `.pages.dev` que te mostró Cloudflare.
7. Cada push a `main` vuelve a publicar el sitio. El del lunes, cuando el Excel del IMSS cambió, también. Las rutas de Vue las resuelve el modo de aplicación de una sola página de Cloudflare. No hace falta un `public/_redirects` que envíe todo a `index.html`: en Workers esa regla se llama a sí misma y el despliegue falla. El service worker no guarda `guarderias.json`.

Antes de publicar, escribe el correo de contacto en `src/domain/sitio.ts`. Mientras esté vacío, el pie no muestra un enlace de correo y la página de privacidad avisa que falta.

## Anuncios

El script de AdSense, con la cuenta `ca-pub-5855061986869939`, está en el `<head>` de `index.html`. El mapa, las preguntas frecuentes, el aviso legal y la privacidad comparten ese HTML, así que el script va en todas. Al cambiar de página, la aplicación lo vuelve a comprobar y no lo duplica. `public/ads.txt` declara la misma cuenta. No hace falta una variable en Cloudflare ni un servidor.

En AdSense deja apagados los anuncios automáticos. Si se encienden, Google puede tapar el mapa. El bloque manual está en el listado y al final de las páginas de texto. Si creas un bloque de display y AdSense te da un `data-ad-slot`, pégalo en `anuncioSlot` dentro de `src/domain/sitio.ts`.

AdSense puede rechazar el sitio si considera que un directorio tiene poco contenido propio. Además del mapa hay guías, fichas por estado y fichas de municipios con al menos cinco unidades. El build escribe esas rutas en `dist` y regenera `sitemap.xml`.
