<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { sitio } from '@/domain/sitio'
</script>

<template>
  <div class="app">
    <header class="barra">
      <RouterLink to="/" class="marca">Mapa de guarderías</RouterLink>
    </header>
    <main>
      <RouterView />
    </main>
    <footer class="pie">
      <p>No es un sitio del IMSS.</p>
      <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
      <RouterLink to="/privacidad">Privacidad</RouterLink>
      <a v-if="sitio.correo" :href="`mailto:${sitio.correo}`">{{ sitio.correo }}</a>
    </footer>
  </div>
</template>
