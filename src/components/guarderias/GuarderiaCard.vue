<script setup lang="ts">
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
    <span class="card-meta">{{ guarderia.clave_presupuestal }}</span>
    <span class="card-lugar">
      {{ [guarderia.municipio, guarderia.estado].filter(Boolean).join(', ') }}
    </span>
    <span v-if="distancia" class="card-distancia">{{ distancia }}</span>
  </button>
</template>
