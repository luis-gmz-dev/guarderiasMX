<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { coincide } from '@/domain/texto-busqueda'

const props = defineProps<{
  etiqueta: string
  valor: string
  opciones: string[]
  placeholder: string
  deshabilitado?: boolean
}>()

const emit = defineEmits<{
  elegir: [value: string]
}>()

const listaId = useId()
const raiz = ref<HTMLElement | null>(null)
const abierto = ref(false)
const texto = ref('')
const activo = ref(0)

const visibles = computed(() => {
  const coinciden = props.opciones.filter((item) => coincide(item, texto.value))
  if (texto.value.trim()) return coinciden
  return ['', ...coinciden]
})

const etiquetaActiva = computed(() => {
  const item = visibles.value[activo.value]
  return item === undefined ? undefined : `${listaId}-${activo.value}`
})

watch(
  () => props.deshabilitado,
  (value) => {
    if (value) cerrar()
  },
)

watch(activo, () => {
  if (!abierto.value) return
  document.getElementById(`${listaId}-${activo.value}`)?.scrollIntoView({ block: 'nearest' })
})

function abrir(): void {
  if (props.deshabilitado) return
  abierto.value = true
  texto.value = ''
  activo.value = 0
}

function cerrar(): void {
  abierto.value = false
  texto.value = ''
  activo.value = 0
}

function elegir(value: string): void {
  emit('elegir', value)
  cerrar()
}

function onInput(event: Event): void {
  texto.value = (event.target as HTMLInputElement).value
  abierto.value = true
  activo.value = 0
}

function onKey(event: KeyboardEvent): void {
  if (props.deshabilitado) return
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!abierto.value) {
      abrir()
      return
    }
    activo.value = Math.min(activo.value + 1, Math.max(visibles.value.length - 1, 0))
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (!abierto.value) {
      abrir()
      return
    }
    activo.value = Math.max(activo.value - 1, 0)
  } else if (event.key === 'Enter' && abierto.value) {
    event.preventDefault()
    const item = visibles.value[activo.value]
    if (item !== undefined) elegir(item)
  } else if (event.key === 'Escape') {
    cerrar()
  }
}

function onDocumento(event: PointerEvent): void {
  if (!raiz.value?.contains(event.target as Node)) cerrar()
}

watch(abierto, (value) => {
  if (value) document.addEventListener('pointerdown', onDocumento)
  else document.removeEventListener('pointerdown', onDocumento)
})

onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumento))

function nombre(item: string): string {
  return item || 'Todos'
}
</script>

<template>
  <label class="combo" ref="raiz">
    {{ etiqueta }}
    <span class="combo-campo">
      <input
        :value="abierto ? texto : valor"
        :placeholder="abierto && valor ? valor : placeholder"
        :disabled="deshabilitado"
        role="combobox"
        aria-autocomplete="list"
        :aria-expanded="abierto"
        :aria-controls="listaId"
        :aria-activedescendant="abierto ? etiquetaActiva : undefined"
        @focus="abrir"
        @input="onInput"
        @keydown="onKey"
      />
      <ChevronDown class="combo-icono" :size="16" aria-hidden="true" />
    </span>
    <ul v-if="abierto" :id="listaId" class="combo-lista" role="listbox" @pointerdown.prevent>
      <li v-if="visibles.length === 0" class="combo-vacio">Sin coincidencias</li>
      <li v-for="(item, indice) in visibles" :key="`${item}-${indice}`">
        <button
          :id="`${listaId}-${indice}`"
          type="button"
          role="option"
          :aria-selected="indice === activo"
          :class="{ activo: indice === activo }"
          @click="elegir(item)"
        >
          {{ nombre(item) }}
        </button>
      </li>
    </ul>
  </label>
</template>
