<script setup lang="ts">
import { computed } from 'vue'
import { direccion, enlaceGoogleMaps, telefonoMarcable } from '@/domain/direccion'
import type { Guarderia } from '@/types/guarderia'

const props = defineProps<{
  guarderia: Guarderia
}>()

const emit = defineEmits<{
  cerrar: []
}>()

const textoDireccion = computed(() => direccion(props.guarderia))
const maps = computed(() => enlaceGoogleMaps(props.guarderia.latitud, props.guarderia.longitud))
const tel = computed(() => telefonoMarcable(props.guarderia.telefono))
</script>

<template>
  <article class="detalle">
    <button type="button" class="texto" @click="emit('cerrar')">Volver al listado</button>
    <h2>{{ guarderia.nombre }}</h2>
    <p class="clave">{{ guarderia.clave_presupuestal }}</p>
    <dl>
      <div v-if="guarderia.horario_atencion">
        <dt>Horario</dt>
        <dd>{{ guarderia.horario_atencion }}</dd>
      </div>
      <div v-if="guarderia.telefono">
        <dt>Teléfono</dt>
        <dd>
          <a v-if="tel" :href="`tel:${tel}`">{{ guarderia.telefono }}</a>
          <template v-else>{{ guarderia.telefono }}</template>
        </dd>
      </div>
      <div v-if="textoDireccion">
        <dt>Dirección</dt>
        <dd>{{ textoDireccion }}</dd>
      </div>
    </dl>
    <a class="boton" :href="maps" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
  </article>
</template>
