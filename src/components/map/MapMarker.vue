<script setup lang="ts">
import type { Guarderia } from '@/types/guarderia'

defineProps<{
  guarderia: Guarderia | null
}>()
</script>

<template>
  <p v-if="guarderia" class="map-chip">{{ guarderia.nombre }}</p>
</template>
