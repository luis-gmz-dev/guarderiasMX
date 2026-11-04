<script setup lang="ts">
import { ChevronRight, MapPin, Navigation } from 'lucide-vue-next'
import type { Guarderia } from '@/types/guarderia'

defineProps<{
  guarderia: Guarderia
  selected: boolean
  distancia: string | null
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <button type="button" class="card" :class="{ selected }" @click="emit('select')">
    <span class="card-nombre">{{ guarderia.nombre }}</span>
    <span class="card-meta">
      <span class="clave">{{ guarderia.clave_presupuestal }}</span>
      <span class="card-lugar">
        <MapPin :size="14" aria-hidden="true" />
        {{ [guarderia.municipio, guarderia.estado].filter(Boolean).join(', ') }}
      </span>
      <span v-if="distancia" class="card-distancia">
        <Navigation :size="13" aria-hidden="true" />
        {{ distancia }}
      </span>
    </span>
    <ChevronRight class="card-flecha" :size="18" aria-hidden="true" />
  </button>
</template>
