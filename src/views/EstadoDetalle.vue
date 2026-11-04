<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, ChevronRight, Info, Map, MapPin } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { useGuarderias } from '@/composables/useGuarderias'
import { agruparEstados, buscarEstado, enlaceMapa, notaEstado, UMBRAL_MUNICIPIO } from '@/domain/lugares'
import { metaEstado } from '@/domain/paginas'
import { aplicarSeo } from '@/domain/seo'

const route = useRoute()
const store = useGuarderias()
const estado = computed(() => buscarEstado(agruparEstados(store.items), String(route.params.slug ?? '')))
const municipiosConPagina = computed(
  () => estado.value?.municipios.filter((item) => item.total >= UMBRAL_MUNICIPIO) ?? [],
)
const municipiosSinPagina = computed(
  () => estado.value?.municipios.filter((item) => item.total < UMBRAL_MUNICIPIO) ?? [],
)
const nota = computed(() => (estado.value ? notaEstado(estado.value.estado) : null))

watch(
  estado,
  (valor) => {
    if (!valor) return
    aplicarSeo(route.path, metaEstado(valor))
  },
  { immediate: true },
)
</script>

<template>
  <article v-if="estado" class="pagina-aviso ancha">
    <p class="miga">
      <RouterLink to="/estados"><ArrowLeft :size="14" aria-hidden="true" />Estados</RouterLink>
    </p>
    <h1>Guarderías del IMSS en {{ estado.etiqueta }}</h1>
    <div class="resumen-cifras">
      <span class="cifra"><strong>{{ estado.total }}</strong> {{ estado.total === 1 ? 'unidad' : 'unidades' }}</span>
      <span class="cifra"><strong>{{ estado.municipios.length }}</strong> municipios</span>
    </div>
    <p class="acciones-pagina">
      <RouterLink class="boton" :to="enlaceMapa(estado.estado)">
        <Map :size="16" aria-hidden="true" />Verlas en el mapa
      </RouterLink>
    </p>
    <p v-if="nota" class="nota-info"><Info :size="16" aria-hidden="true" />{{ nota }}</p>
    <h2 v-if="municipiosConPagina.length">Municipios con más unidades</h2>
    <ul class="lista-paginas rejilla">
      <li v-for="(municipio, indice) in municipiosConPagina" :key="municipio.slug" :style="{ '--i': indice }">
        <RouterLink class="tarjeta-enlace" :to="`/municipios/${municipio.estadoSlug}/${municipio.slug}`">
          <span class="icono-caja"><MapPin :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>{{ municipio.etiqueta }}</strong>
            <small>{{ municipio.total }} unidades</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>
    <h2 v-if="municipiosSinPagina.length">Otros municipios</h2>
    <p v-if="municipiosSinPagina.length" class="lista-corta">
      <RouterLink
        v-for="municipio in municipiosSinPagina"
        :key="municipio.slug"
        class="etiqueta-enlace"
        :to="enlaceMapa(municipio.estado, municipio.municipio)"
      >
        {{ municipio.etiqueta }} <span>{{ municipio.total }}</span>
      </RouterLink>
    </p>
    <BloqueAnuncio />
  </article>
  <article v-else-if="!store.loading" class="pagina-aviso">
    <h1>No está ese estado</h1>
    <p><RouterLink to="/estados">Volver a los estados</RouterLink></p>
  </article>
  <article v-else class="pagina-aviso">
    <div class="esqueletos" aria-busy="true" aria-label="Cargando"><span></span><span></span><span></span></div>
  </article>
</template>
