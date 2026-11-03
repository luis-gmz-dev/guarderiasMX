<script setup lang="ts">
import { LocateFixed } from 'lucide-vue-next'

defineProps<{
  pending: boolean
}>()

const emit = defineEmits<{
  ubicar: []
}>()
</script>

<template>
  <button type="button" class="ubicacion" :disabled="pending" @click="emit('ubicar')">
    <LocateFixed :size="18" aria-hidden="true" />
    {{ pending ? 'Buscando…' : 'Mi ubicación' }}
  </button>
</template>
