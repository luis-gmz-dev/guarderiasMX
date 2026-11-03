import { computed, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { distanciaMetros } from '@/domain/geo'
import { textoBusqueda } from '@/domain/texto-busqueda'
import { leerDirectorio } from '@/services/directorio'
import type { Coordenadas, Guarderia } from '@/types/guarderia'

function texto(guarderia: Guarderia): string {
  return textoBusqueda(
    [
      guarderia.nombre,
      guarderia.clave_presupuestal,
      guarderia.colonia,
      guarderia.municipio,
      guarderia.localidad,
      guarderia.estado,
    ]
      .filter((parte): parte is string => Boolean(parte))
      .join(' '),
  )
}

export const useGuarderiasStore = defineStore('guarderias', () => {
  const items = shallowRef<Guarderia[]>([])
  const actualizado = ref<string | null>(null)
  const loaded = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const query = ref('')
  const estado = ref('')
  const municipio = ref('')
  const selectedClave = ref<string | null>(null)
  const userLocation = ref<Coordenadas | null>(null)

  const estados = computed(() =>
    [...new Set(items.value.map((item) => item.estado).filter((item): item is string => Boolean(item)))].sort(
      (a, b) => a.localeCompare(b, 'es-MX'),
    ),
  )

  const municipios = computed(() => {
    if (!estado.value) return []
    const base = items.value.filter((item) => item.estado === estado.value)
    return [...new Set(base.map((item) => item.municipio).filter((item): item is string => Boolean(item)))].sort(
      (a, b) => a.localeCompare(b, 'es-MX'),
    )
  })

  const filtradas = computed(() => {
    const q = textoBusqueda(query.value.trim())
    const lista = items.value.filter((item) => {
      if (estado.value && item.estado !== estado.value) return false
      if (municipio.value && item.municipio !== municipio.value) return false
      if (q && !texto(item).includes(q)) return false
      return true
    })
    const ubicacion = userLocation.value
    if (!ubicacion) {
      return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es-MX'))
    }
    return [...lista].sort(
      (a, b) =>
        distanciaMetros(ubicacion, a) - distanciaMetros(ubicacion, b),
    )
  })

  const seleccionada = computed(
    () => items.value.find((item) => item.clave_presupuestal === selectedClave.value) ?? null,
  )

  async function load(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const directorio = await leerDirectorio()
      items.value = directorio.guarderias
      actualizado.value = directorio.actualizado
      loaded.value = true
    } catch {
      error.value = 'No se pudieron cargar las guarderías.'
    } finally {
      loading.value = false
    }
  }

  function select(clave: string | null): void {
    selectedClave.value = clave
  }

  function setEstado(value: string): void {
    estado.value = value
    if (municipio.value && !municipios.value.includes(municipio.value)) municipio.value = ''
  }

  return {
    items,
    actualizado,
    loaded,
    loading,
    error,
    query,
    estado,
    municipio,
    selectedClave,
    userLocation,
    estados,
    municipios,
    filtradas,
    seleccionada,
    load,
    select,
    setEstado,
  }
})
