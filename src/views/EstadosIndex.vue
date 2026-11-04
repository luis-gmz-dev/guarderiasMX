<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChevronRight, Map, MapPin } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { useGuarderias } from '@/composables/useGuarderias'
import { agruparEstados } from '@/domain/lugares'

const store = useGuarderias()
const estados = computed(() => agruparEstados(store.items))
</script>

<template>
  <article class="pagina-aviso ancha">
    <header class="cabecera-pagina">
      <span class="icono-caja grande"><Map :size="26" aria-hidden="true" /></span>
      <div>
        <h1>Guarderías del IMSS por estado</h1>
        <p class="entradilla">
          Unidades del directorio público. Elige un estado. Este mapa no es un sitio del IMSS.
        </p>
      </div>
    </header>
    <div v-if="store.loading" class="esqueletos rejilla" aria-busy="true" aria-label="Cargando estados">
      <span v-for="n in 9" :key="n"></span>
    </div>
    <p v-else-if="store.error" class="aviso" role="alert">{{ store.error }}</p>
    <ul v-else class="lista-paginas rejilla">
      <li v-for="(estado, indice) in estados" :key="estado.slug" :style="{ '--i': indice }">
        <RouterLink class="tarjeta-enlace" :to="`/estados/${estado.slug}`">
          <span class="icono-caja"><MapPin :size="18" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>{{ estado.etiqueta }}</strong>
            <small>{{ estado.total }} {{ estado.total === 1 ? 'unidad' : 'unidades' }}</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>
    <BloqueAnuncio />
  </article>
</template>
