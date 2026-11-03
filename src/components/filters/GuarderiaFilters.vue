<script setup lang="ts">
import FiltroBuscable from '@/components/filters/FiltroBuscable.vue'

defineProps<{
  estados: string[]
  municipios: string[]
  estado: string
  municipio: string
}>()

const emit = defineEmits<{
  'update:estado': [value: string]
  'update:municipio': [value: string]
}>()
</script>

<template>
  <div class="filtros">
    <FiltroBuscable
      etiqueta="Estado"
      :valor="estado"
      :opciones="estados"
      placeholder="Todos los estados"
      @elegir="emit('update:estado', $event)"
    />
    <FiltroBuscable
      etiqueta="Municipio"
      :valor="municipio"
      :opciones="municipios"
      :deshabilitado="!estado"
      :placeholder="estado ? 'Todos los municipios' : 'Primero elige un estado'"
      @elegir="emit('update:municipio', $event)"
    />
  </div>
</template>
