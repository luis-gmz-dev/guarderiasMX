<script setup lang="ts">
import { sitio } from '@/domain/sitio'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Privacidad</h1>
    <p>No hay cuentas ni registro. Este sitio no te pide nombre, correo ni teléfono.</p>
    <p>
      Si pulsas <strong>Mi ubicación</strong>, el navegador usa ese dato solo en tu equipo para ordenar
      las guarderías por distancia. No se envía a un servidor de este mapa.
    </p>
    <p>
      El listado puede mostrar un anuncio de Google AdSense, cuenta {{ sitio.adsense }}. Google puede
      guardar cookies para medir y elegir ese anuncio. Su información está en la
      <a href="https://policies.google.com/privacy">política de privacidad de Google</a>
      y en
      <a href="https://policies.google.com/technologies/ads">cómo usa Google las cookies de publicidad</a>.
    </p>
    <p v-if="sitio.correo">
      Contacto:
      <a :href="`mailto:${sitio.correo}`">{{ sitio.correo }}</a>
    </p>
    <p v-else>El correo de contacto se publicará en esta página antes de ofrecer el sitio al público.</p>
  </article>
</template>
