import { onMounted } from 'vue'
import { useGuarderiasStore } from '@/stores/guarderias.store'

export function useGuarderias() {
  const store = useGuarderiasStore()
  onMounted(() => {
    if (!store.loaded) void store.load()
  })
  return store
}
