<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { sitio } from '@/domain/sitio'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Aviso legal</h1>
    <p class="entradilla">
      {{ sitio.nombre }} es una consulta independiente del directorio público de guarderías. No es un sitio
      del IMSS.
    </p>

    <h2>Por qué existe</h2>
    <p>
      El IMSS publica el directorio en una hoja de cálculo. Este mapa la muestra para buscar por nombre,
      clave, estado o municipio y abrir la ruta en otro mapa. Esa es toda la función: facilitar la
      consulta. No inscribe, no asigna lugar y no sustituye el trámite ante el IMSS.
    </p>

    <h2>Quién lo publica</h2>
    <p>
      El sitio lo mantiene quien opera {{ sitio.url }}. No forma parte de las páginas del IMSS, no lo
      representa y no habla en su nombre. Los nombres, logos y marcas del IMSS le pertenecen.
    </p>
    <p v-if="sitio.correo">
      Contacto:
      <a :href="`mailto:${sitio.correo}`">{{ sitio.correo }}</a>
    </p>
    <p v-else>
      El correo de contacto se publicará en esta página y en
      <RouterLink to="/privacidad">privacidad</RouterLink>
      antes de ofrecer el sitio al público.
    </p>

    <h2>De dónde salen los datos</h2>
    <p>
      La lista sale del directorio público que el IMSS publica en Excel. La copia de esta página es la de
      la fecha que se muestra en el mapa. El archivo de origen está en
      <a :href="sitio.fuenteExcel">{{ sitio.fuenteExcel }}</a>.
    </p>
    <p>
      Se usa ese archivo porque es la fuente pública y actualizable. No se inventan unidades ni se
      completa el directorio con otros listados. Si el Excel no trae un dato, aquí tampoco aparece.
    </p>

    <h2>Qué no garantiza</h2>
    <p>
      Una guardería puede cambiar de domicilio, teléfono u horario después de la fecha de la copia.
      Confirma el dato con la guardería o con el IMSS antes de ir. El mapa no responde por decisiones
      tomadas solo con esta consulta.
    </p>

    <h2>Orden de la lista</h2>
    <p>
      Aparecer aquí no tiene costo. Nadie puede pagar para subir, bajar u ocultar una unidad. El orden
      sigue la búsqueda, el estado, el municipio y, si lo pides, la distancia. Los anuncios no cambian
      ese orden.
    </p>

    <h2>Anuncios</h2>
    <p>
      El sitio se ofrece sin cobro al visitante. Para cubrir el hospedaje puede mostrar anuncios de
      Google AdSense, cuenta {{ sitio.adsense }}. La publicidad es de Google, no una recomendación de
      este mapa ni del IMSS. El detalle de cookies está en
      <RouterLink to="/privacidad">privacidad</RouterLink>.
    </p>
    <BloqueAnuncio />
  </article>
</template>
