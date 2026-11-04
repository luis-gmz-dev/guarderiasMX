<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import MapCanvas from '@/components/map/MapView.vue'
import MapMarker from '@/components/map/MapMarker.vue'
import UserLocation from '@/components/map/UserLocation.vue'
import GuarderiaDetail from '@/components/guarderias/GuarderiaDetail.vue'
import GuarderiaList from '@/components/guarderias/GuarderiaList.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useGuarderias } from '@/composables/useGuarderias'
import { etiquetaActualizacion } from '@/domain/actualizacion'

const store = useGuarderias()
const route = useRoute()
const { error: errorUbicacion, pending: ubicando, request: pedirUbicacion } = useGeolocation()
const encuadre = ref(0)
const etiqueta = computed(() => etiquetaActualizacion(store.actualizado))

watch(
  () => store.items.length,
  (total, anterior) => {
    if (anterior === 0 && total > 0) encuadre.value += 1
  },
)

watch(
  () => [store.estado, store.municipio],
  () => {
    encuadre.value += 1
  },
)

watch(
  () => [store.loaded, route.query.estado, route.query.municipio],
  () => {
    if (!store.loaded) return
    const estado = typeof route.query.estado === 'string' ? route.query.estado : ''
    const municipio = typeof route.query.municipio === 'string' ? route.query.municipio : ''
    if (estado && store.estados.includes(estado)) store.setEstado(estado)
    else store.setEstado('')
    if (municipio && store.municipios.includes(municipio)) store.municipio = municipio
    else store.municipio = ''
  },
  { immediate: true },
)

function ubicar(): void {
  pedirUbicacion((coords) => {
    store.userLocation = coords
  })
}

</script>

<template>
  <section class="mapa-pagina">
    <p v-if="etiqueta" class="nota-actualizacion">{{ etiqueta }}</p>
    <div class="mapa-cuerpo">
      <div class="panel-lista">
        <GuarderiaDetail
          v-if="store.seleccionada"
          :guarderia="store.seleccionada"
          @cerrar="store.select(null)"
        />
        <GuarderiaList
          :guarderias="store.filtradas"
          :total="store.items.length"
          :query="store.query"
          :estados="store.estados"
          :municipios="store.municipios"
          :estado="store.estado"
          :municipio="store.municipio"
          :selected-clave="store.selectedClave"
          :user-location="store.userLocation"
          :loading="store.loading"
          :error="store.error"
          @update:query="store.query = $event"
          @update:estado="store.setEstado($event)"
          @update:municipio="store.municipio = $event"
          @select="store.select($event)"
        />
      </div>
      <div class="panel-mapa">
        <MapCanvas
          :guarderias="store.filtradas"
          :selected-clave="store.selectedClave"
          :user-location="store.userLocation"
          :encuadre="encuadre"
          @select="store.select($event)"
        />
        <div class="controles-mapa">
          <UserLocation :pending="ubicando" @ubicar="ubicar" />
          <MapMarker :guarderia="store.seleccionada" />
        </div>
        <p v-if="errorUbicacion" class="aviso flotante">{{ errorUbicacion }}</p>
      </div>
    </div>
  </section>
</template>
