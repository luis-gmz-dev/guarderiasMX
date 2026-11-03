<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { htmlMarcador } from '@/components/map/marcador'
import type { Coordenadas, Guarderia } from '@/types/guarderia'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
})

const props = defineProps<{
  guarderias: Guarderia[]
  selectedClave: string | null
  userLocation: Coordenadas | null
  encuadre: number
}>()

const emit = defineEmits<{
  select: [clave: string]
}>()

const elemento = shallowRef<HTMLElement | null>(null)
const mapa = shallowRef<L.Map | null>(null)
let cluster: L.MarkerClusterGroup | null = null
let usuario: L.CircleMarker | null = null
const marcadores = new Map<string, L.Marker>()
const observadores = new Map<L.Map, ResizeObserver>()

function ajustar(): void {
  const map = mapa.value
  if (!map || !cluster) return
  const bounds = cluster.getBounds()
  if (bounds.isValid()) map.fitBounds(bounds.pad(0.12), { maxZoom: 12 })
}

function dibujar(): void {
  if (!cluster) return
  cluster.clearLayers()
  marcadores.clear()
  for (const guarderia of props.guarderias) {
    const marker = L.marker([guarderia.latitud, guarderia.longitud])
    marker.bindPopup(htmlMarcador(guarderia))
    marker.on('click', () => emit('select', guarderia.clave_presupuestal))
    cluster.addLayer(marker)
    marcadores.set(guarderia.clave_presupuestal, marker)
  }
}

onMounted(() => {
  const nodo = elemento.value
  if (!nodo) return
  const map = L.map(nodo, { zoomControl: true }).setView([23.6, -102.5], 5)
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)
  cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    disableClusteringAtZoom: 16,
  })
  map.addLayer(cluster)
  mapa.value = map
  dibujar()
  ajustar()
  const observador = new ResizeObserver(() => map.invalidateSize())
  observador.observe(nodo)
  observadores.set(map, observador)
})

watch(
  () => props.guarderias,
  () => {
    dibujar()
  },
)

watch(
  () => props.encuadre,
  () => ajustar(),
)

watch(
  () => props.selectedClave,
  (clave) => {
    if (!clave) return
    const marker = marcadores.get(clave)
    const map = mapa.value
    if (!marker || !map) return
    const punto = marker.getLatLng()
    map.flyTo(punto, Math.max(map.getZoom(), 15), { duration: 0.5 })
    marker.openPopup()
  },
)

watch(
  () => props.userLocation,
  (coords) => {
    const map = mapa.value
    if (!map) return
    if (usuario) map.removeLayer(usuario)
    if (!coords) return
    usuario = L.circleMarker([coords.latitud, coords.longitud], {
      radius: 8,
      color: '#1d4e89',
      weight: 2,
      fillColor: '#7eb6e6',
      fillOpacity: 0.95,
    }).addTo(map)
    map.flyTo([coords.latitud, coords.longitud], 13)
  },
)

onBeforeUnmount(() => {
  const map = mapa.value
  if (map) observadores.get(map)?.disconnect()
  map?.remove()
  mapa.value = null
})
</script>

<template>
  <div ref="elemento" class="lienzo"></div>
</template>
