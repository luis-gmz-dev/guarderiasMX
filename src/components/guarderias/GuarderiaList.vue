<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-vue-next'
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
const filtrosActivos = computed(() => Number(Boolean(props.estado)) + Number(Boolean(props.municipio)))
const filtrosVisibles = ref(false)

const texto = ref(props.query)
let temporizador: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.query,
  (valor) => {
    if (valor !== texto.value) texto.value = valor
  },
)

function alEscribir(valor: string): void {
  texto.value = valor
  clearTimeout(temporizador)
  temporizador = setTimeout(() => emit('update:query', valor), 140)
}

function borrarBusqueda(): void {
  clearTimeout(temporizador)
  texto.value = ''
  emit('update:query', '')
}

onBeforeUnmount(() => clearTimeout(temporizador))

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
        <span class="solo-lector">Buscar</span>
        <input
          :value="texto"
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          placeholder="Nombre, clave, colonia o municipio"
          @input="alEscribir(($event.target as HTMLInputElement).value)"
          @keydown.esc="borrarBusqueda"
        />
        <Transition name="icono">
          <button v-if="texto" type="button" class="busqueda-limpiar" aria-label="Borrar búsqueda" @click.prevent="borrarBusqueda">
            <X :size="16" aria-hidden="true" />
          </button>
        </Transition>
      </label>
      <button
        type="button"
        class="filtros-toggle"
        :class="{ activo: filtrosVisibles || filtrosActivos > 0 }"
        :aria-expanded="filtrosVisibles"
        @click="filtrosVisibles = !filtrosVisibles"
      >
        <SlidersHorizontal :size="16" aria-hidden="true" />
        {{ filtrosVisibles ? 'Ocultar filtros' : 'Filtros' }}
        <span v-if="filtrosActivos" class="filtros-contador">{{ filtrosActivos }}</span>
      </button>
      <GuarderiaFilters
        :class="{ ocultos: !filtrosVisibles }"
        :estados="estados"
        :municipios="municipios"
        :estado="estado"
        :municipio="municipio"
        @update:estado="emit('update:estado', $event)"
        @update:municipio="emit('update:municipio', $event)"
      />
      <div class="conteo-fila">
        <p class="conteo">{{ conteo() }}</p>
        <button v-if="hayFiltro" type="button" class="texto texto-icono" @click="limpiar">
          <RotateCcw :size="14" aria-hidden="true" />
          Limpiar
        </button>
      </div>
      <p v-if="error" class="aviso" role="alert">{{ error }}</p>
    </div>
    <div class="cards">
      <BloqueAnuncio />
      <div v-if="loading" class="esqueletos" aria-busy="true" aria-label="Cargando guarderías">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <template v-else>
        <p v-if="guarderias.length === 0" class="vacio">Ninguna guardería coincide con la búsqueda.</p>
        <GuarderiaCard
          v-for="guarderia in guarderias"
          :key="guarderia.clave_presupuestal"
          :guarderia="guarderia"
          :selected="guarderia.clave_presupuestal === selectedClave"
          :distancia="distancia(guarderia)"
          @select="emit('select', guarderia.clave_presupuestal)"
        />
      </template>
    </div>
  </div>
</template>
