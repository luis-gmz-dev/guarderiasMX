<script setup lang="ts">
import { computed, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, Clock, Map, MapPin, Phone } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { useGuarderias } from '@/composables/useGuarderias'
import { telefonoMarcable } from '@/domain/direccion'
import { agruparEstados, buscarMunicipio, enlaceMapa, filtrarLugar, nombreUnidad } from '@/domain/lugares'
import { metaMunicipio } from '@/domain/paginas'
import { aplicarSeo } from '@/domain/seo'

const route = useRoute()
const store = useGuarderias()
const municipio = computed(() =>
  buscarMunicipio(
    agruparEstados(store.items),
    String(route.params.estado ?? ''),
    String(route.params.municipio ?? ''),
  ),
)
const unidades = computed(() =>
  municipio.value ? filtrarLugar(store.items, municipio.value.estado, municipio.value.municipio) : [],
)

watch(
  municipio,
  (valor) => {
    if (!valor) return
    aplicarSeo(route.path, metaMunicipio(valor))
  },
  { immediate: true },
)
</script>

<template>
  <article v-if="municipio" class="pagina-aviso ancha">
    <p class="miga">
      <RouterLink :to="`/estados/${municipio.estadoSlug}`">
        <ArrowLeft :size="14" aria-hidden="true" />{{ municipio.estadoEtiqueta }}
      </RouterLink>
    </p>
    <h1>Guarderías del IMSS en {{ municipio.etiqueta }}</h1>
    <div class="resumen-cifras">
      <span class="cifra"><strong>{{ municipio.total }}</strong> unidades</span>
      <span class="cifra">{{ municipio.estadoEtiqueta }}</span>
    </div>
    <p class="acciones-pagina">
      <RouterLink class="boton" :to="enlaceMapa(municipio.estado, municipio.municipio)">
        <Map :size="16" aria-hidden="true" />Verlas en el mapa
      </RouterLink>
    </p>
    <ul class="lista-unidades">
      <li v-for="(unidad, indice) in unidades" :key="unidad.clave_presupuestal" :style="{ '--i': indice }">
        <strong>{{ nombreUnidad(unidad.nombre) }}</strong>
        <span v-if="unidad.colonia" class="dato"><MapPin :size="14" aria-hidden="true" />{{ unidad.colonia }}</span>
        <span v-if="unidad.horario_atencion" class="dato">
          <Clock :size="14" aria-hidden="true" />{{ unidad.horario_atencion }}
        </span>
        <span v-if="unidad.telefono" class="dato">
          <Phone :size="14" aria-hidden="true" />
          <a v-if="telefonoMarcable(unidad.telefono)" :href="`tel:${telefonoMarcable(unidad.telefono)}`">
            {{ unidad.telefono }}
          </a>
          <template v-else>{{ unidad.telefono }}</template>
        </span>
      </li>
    </ul>
    <BloqueAnuncio />
  </article>
  <article v-else-if="!store.loading" class="pagina-aviso">
    <h1>No hay ficha de ese municipio</h1>
    <p>Solo publicamos ficha cuando hay al menos cinco unidades.</p>
    <p><RouterLink to="/estados">Volver a los estados</RouterLink></p>
  </article>
  <article v-else class="pagina-aviso">
    <div class="esqueletos" aria-busy="true" aria-label="Cargando"><span></span><span></span><span></span></div>
  </article>
</template>
