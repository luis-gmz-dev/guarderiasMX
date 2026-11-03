<script setup lang="ts">
import { computed } from 'vue'
import { Search } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import GuarderiaCard from '@/components/guarderias/GuarderiaCard.vue'
import GuarderiaFilters from '@/components/filters/GuarderiaFilters.vue'
import { distanciaMetros } from '@/domain/geo'
import type { Coordenadas, Guarderia } from '@/types/guarderia'

const props = defineProps<{
  guarderias: Guarderia[]
  total: number
  query: string
  estados: string[]
  municipios: string[]
  estado: string
  municipio: string
  selectedClave: string | null
  userLocation: Coordenadas | null
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'update:query': [value: string]
  'update:estado': [value: string]
  'update:municipio': [value: string]
  select: [clave: string]
}>()

function distancia(guarderia: Guarderia): string | null {
  if (!props.userLocation) return null
  const metros = distanciaMetros(props.userLocation, guarderia)
  if (metros < 1000) return `${Math.round(metros)} m`
  return `${(metros / 1000).toLocaleString('es-MX', { maximumFractionDigits: 1 })} km`
}

const hayFiltro = computed(() => Boolean(props.query || props.estado || props.municipio))

function conteo(): string {
  if (props.loading) return 'Cargando…'
  const visibles = props.guarderias.length.toLocaleString('es-MX')
  const total = props.total.toLocaleString('es-MX')
  if (!hayFiltro.value) return `${total} guarderías`
  return `${visibles} de ${total}`
}

function limpiar(): void {
  emit('update:query', '')
  emit('update:estado', '')
  emit('update:municipio', '')
}
</script>

<template>
  <div class="listado">
    <div class="listado-controles">
      <h1 class="titulo-mapa">Directorio público de guarderías</h1>
      <label class="busqueda">
        <Search :size="18" aria-hidden="true" />
        <input
          :value="query"
          type="search"
          placeholder="Nombre, clave, colonia o municipio"
          @input="emit('update:query', ($event.target as HTMLInputElement).value)"
        />
      </label>
      <GuarderiaFilters
        :estados="estados"
        :municipios="municipios"
        :estado="estado"
        :municipio="municipio"
        @update:estado="emit('update:estado', $event)"
        @update:municipio="emit('update:municipio', $event)"
      />
      <div class="conteo-fila">
        <p class="conteo">{{ conteo() }}</p>
        <button v-if="hayFiltro" type="button" class="texto" @click="limpiar">Limpiar</button>
      </div>
      <p v-if="error" class="aviso">{{ error }}</p>
      <p v-else-if="!loading && guarderias.length === 0" class="aviso">Ninguna guardería coincide con la búsqueda.</p>
    </div>
    <div class="cards">
      <BloqueAnuncio />
      <GuarderiaCard
        v-for="guarderia in guarderias"
        :key="guarderia.clave_presupuestal"
        :guarderia="guarderia"
        :selected="guarderia.clave_presupuestal === selectedClave"
        :distancia="distancia(guarderia)"
        @select="emit('select', guarderia.clave_presupuestal)"
      />
    </div>
  </div>
</template>
