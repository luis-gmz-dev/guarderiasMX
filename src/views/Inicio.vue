<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight, Clock, Map, MapPin, Search } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { useGuarderias } from '@/composables/useGuarderias'
import { etiquetaActualizacion } from '@/domain/actualizacion'
import { agruparEstados } from '@/domain/lugares'
import { sitio } from '@/domain/sitio'

const store = useGuarderias()
const estados = computed(() => agruparEstados(store.items))
const actualizacion = computed(() => etiquetaActualizacion(store.actualizado))
</script>

<template>
  <article class="pagina-aviso ancha">
    <header class="cabecera-pagina">
      <span class="icono-caja grande"><Map :size="26" aria-hidden="true" /></span>
      <div>
        <h1>Directorio y mapa de guarderías del IMSS</h1>
        <p class="entradilla">
          Aquí puedes ver dónde están las guarderías del IMSS y el horario que trae cada una. A veces se busca
          como diccionario de guarderías; la lista es el directorio público, no un diccionario aparte. No es un
          sitio del IMSS y no inscribe a nadie.
        </p>
      </div>
    </header>

    <div v-if="store.items.length" class="resumen-cifras">
      <span class="cifra"><strong>{{ store.items.length }}</strong> unidades</span>
      <span class="cifra"><strong>{{ estados.length }}</strong> estados</span>
      <span v-if="actualizacion" class="cifra">{{ actualizacion }}</span>
    </div>
    <p v-else-if="store.error" class="aviso" role="alert">{{ store.error }}</p>

    <p class="acciones-pagina">
      <RouterLink class="boton boton-grande" to="/mapa">
        <Map :size="22" aria-hidden="true" />Entrar al mapa
      </RouterLink>
      <RouterLink class="boton secundario" to="/estados">
        <MapPin :size="16" aria-hidden="true" />Ver por estado
      </RouterLink>
    </p>

    <ul class="lista-paginas rejilla">
      <li>
        <RouterLink class="tarjeta-enlace" to="/estados">
          <span class="icono-caja"><MapPin :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>Dónde están</strong>
            <small>La lista por estado y municipio, con la dirección del Excel.</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
      <li>
        <RouterLink class="tarjeta-enlace" to="/guias/costo-y-horario">
          <span class="icono-caja"><Clock :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>Horarios</strong>
            <small>Cada unidad trae el suyo. No hay un horario único.</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
      <li>
        <RouterLink class="tarjeta-enlace" to="/guias/como-usar-el-mapa">
          <span class="icono-caja"><Search :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>Cómo buscar</strong>
            <small>Por nombre, clave, colonia o municipio.</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
      <li>
        <RouterLink class="tarjeta-enlace" to="/guias/como-leer-el-directorio">
          <span class="icono-caja"><Map :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>Cómo leer una fila</strong>
            <small>Clave, horario, teléfono y dirección.</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>

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
