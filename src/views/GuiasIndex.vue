<script setup lang="ts">
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'
import { Banknote, BookOpen, ChevronRight, ClipboardList, Map, Tags, Users } from 'lucide-vue-next'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { guias } from '@/domain/guias'

const iconos: Record<string, Component> = {
  'quien-tiene-derecho': Users,
  'requisitos-e-inscripcion': ClipboardList,
  'costo-y-horario': Banknote,
  esquemas: Tags,
}
</script>

<template>
  <article class="pagina-aviso">
    <header class="cabecera-pagina">
      <span class="icono-caja grande"><BookOpen :size="26" aria-hidden="true" /></span>
      <div>
        <h1>Guías de guarderías del IMSS</h1>
        <p class="entradilla">
          Texto propio para ubicar el trámite. Este mapa no es un sitio del IMSS y no inscribe a nadie.
        </p>
      </div>
    </header>
    <ul class="lista-paginas">
      <li v-for="(guia, indice) in guias" :key="guia.slug" :style="{ '--i': indice }">
        <RouterLink class="tarjeta-enlace" :to="`/guias/${guia.slug}`">
          <span class="icono-caja"><component :is="iconos[guia.slug] ?? BookOpen" :size="20" aria-hidden="true" /></span>
          <span class="tarjeta-texto">
            <strong>{{ guia.titulo }}</strong>
            <small>{{ guia.descripcion }}</small>
          </span>
          <ChevronRight class="tarjeta-flecha" :size="18" aria-hidden="true" />
        </RouterLink>
      </li>
    </ul>
    <p class="acciones-pagina">
      <RouterLink class="boton" to="/"><Map :size="16" aria-hidden="true" />Abrir el mapa</RouterLink>
      <RouterLink class="boton secundario" to="/estados">Ver por estado</RouterLink>
    </p>
    <BloqueAnuncio />
  </article>
</template>
