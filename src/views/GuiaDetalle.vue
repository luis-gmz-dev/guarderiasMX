<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowLeft, Map, MapPin } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { buscarGuia } from '@/domain/guias'

const route = useRoute()
const guia = computed(() => buscarGuia(String(route.params.slug ?? '')))
</script>

<template>
  <article v-if="guia" class="pagina-aviso">
    <p class="miga">
      <RouterLink to="/guias"><ArrowLeft :size="14" aria-hidden="true" />Guías</RouterLink>
    </p>
    <h1>{{ guia.titulo }}</h1>
    <div class="cuerpo-guia">
      <template v-for="(bloque, indice) in guia.bloques" :key="indice">
        <h2 v-if="bloque.tipo === 'h2'">{{ bloque.texto }}</h2>
        <p v-else-if="bloque.tipo === 'p'">{{ bloque.texto }}</p>
        <ul v-else-if="bloque.tipo === 'lista'">
          <li v-for="item in bloque.items" :key="item">{{ item }}</li>
        </ul>
      </template>
    </div>
    <p class="acciones-pagina">
      <RouterLink class="boton" to="/"><Map :size="16" aria-hidden="true" />Ver el mapa</RouterLink>
      <RouterLink class="boton secundario" to="/estados">
        <MapPin :size="16" aria-hidden="true" />Guarderías por estado
      </RouterLink>
    </p>
    <BloqueAnuncio />
  </article>
  <article v-else class="pagina-aviso">
    <h1>No está esa guía</h1>
    <p><RouterLink to="/guias">Volver a las guías</RouterLink></p>
  </article>
</template>
