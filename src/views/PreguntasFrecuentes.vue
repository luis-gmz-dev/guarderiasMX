<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { preguntas } from '@/domain/preguntas'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Preguntas frecuentes</h1>
    <p class="entradilla">Respuestas sobre este mapa. No es un sitio del IMSS.</p>
    <section>
      <article v-for="item in preguntas" :key="item.pregunta" class="pregunta">
        <h2>{{ item.pregunta }}</h2>
        <p>{{ item.respuesta }}</p>
      </article>
    </section>
    <p>
      Más detalle en las
      <RouterLink to="/guias">guías</RouterLink>:
      <RouterLink to="/guias/quien-tiene-derecho">quién tiene derecho</RouterLink>,
      <RouterLink to="/guias/requisitos-e-inscripcion">requisitos</RouterLink>,
      <RouterLink to="/guias/costo-y-horario">costo y horario</RouterLink>
      y
      <RouterLink to="/guias/esquemas">esquemas</RouterLink>.
    </p>
    <BloqueAnuncio />
  </article>
</template>
