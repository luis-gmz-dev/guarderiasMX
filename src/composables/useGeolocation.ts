import { ref } from 'vue'
import type { Coordenadas } from '@/types/guarderia'

export function useGeolocation() {
  const error = ref<string | null>(null)
  const pending = ref(false)

  function request(onSuccess: (coords: Coordenadas) => void): void {
    if (!navigator.geolocation) {
      error.value = 'Este navegador no comparte la ubicación.'
      return
    }
    pending.value = true
    error.value = null
    navigator.geolocation.getCurrentPosition(
      (position) => {
        pending.value = false
        onSuccess({
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
        })
      },
      () => {
        pending.value = false
        error.value = 'No se pudo obtener la ubicación. Revisa el permiso del navegador.'
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  return { error, pending, request }
}
