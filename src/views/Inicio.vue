<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Map, MapPin } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { sitio } from '@/domain/sitio'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Directorio y mapa de guarderías del IMSS</h1>
    <p class="entradilla">
      Aquí puedes ver dónde están las guarderías del IMSS y el horario que trae cada una. A veces se busca
      como diccionario de guarderías; la lista es el directorio público, no un diccionario aparte. No es un
      sitio del IMSS y no inscribe a nadie.
    </p>
    <p class="acciones-pagina">
      <RouterLink class="boton" to="/mapa"><Map :size="16" aria-hidden="true" />Abrir el mapa</RouterLink>
      <RouterLink class="boton secundario" to="/estados">
        <MapPin :size="16" aria-hidden="true" />Ver por estado
      </RouterLink>
    </p>

    <h2>Dónde están las guarderías del IMSS</h2>
    <p>
      Las unidades de esta copia están repartidas por estado y municipio. La lista por entidad está en
      <RouterLink to="/estados">guarderías por estado</RouterLink>.
      Desde ahí, o desde el
      <RouterLink to="/mapa">mapa</RouterLink>,
      se abre la ficha con la dirección que viene en el Excel.
    </p>

    <h2>Horarios de las guarderías del IMSS</h2>
    <p>
      No hay un horario único. Cada fila del directorio trae el suyo, y en esta copia el más frecuente es
      de 07:00 a 16:00. El detalle de costo y turno está en
      <RouterLink to="/guias/costo-y-horario">costo y horario</RouterLink>.
      Cómo se lee ese campo está en
      <RouterLink to="/guias/como-leer-el-directorio">cómo leer el directorio</RouterLink>.
    </p>

    <h2>Cómo buscar una guardería</h2>
    <p>
      En el mapa se puede buscar por nombre, clave, colonia o municipio. La explicación corta está en
      <RouterLink to="/guias/como-usar-el-mapa">cómo usar el mapa</RouterLink>
      y las dudas del sitio en
      <RouterLink to="/preguntas-frecuentes">preguntas frecuentes</RouterLink>.
    </p>

    <h2>De dónde sale</h2>
    <p>
      Los nombres, horarios, teléfonos y direcciones salen del
      <a :href="sitio.fuenteExcel">directorio público que el IMSS publica en Excel</a>.
      Si el archivo no trae un dato, aquí no se inventa. El alcance del sitio está en el
      <RouterLink to="/aviso-legal">aviso legal</RouterLink>.
    </p>
    <BloqueAnuncio />
  </article>
</template>
