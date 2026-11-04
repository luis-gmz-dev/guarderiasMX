<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Clock, MapPin, Navigation, Phone } from 'lucide-vue-next'
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
    <div class="detalle-barra">
      <button type="button" class="texto texto-icono" @click="emit('cerrar')">
        <ArrowLeft :size="16" aria-hidden="true" />
        Volver al listado
      </button>
      <a class="boton" :href="maps" target="_blank" rel="noopener noreferrer">
        <Navigation :size="16" aria-hidden="true" />
        Cómo llegar
      </a>
    </div>
    <h2>{{ guarderia.nombre }}</h2>
    <p class="clave">{{ guarderia.clave_presupuestal }}</p>
    <dl>
      <div v-if="guarderia.horario_atencion">
        <dt><Clock :size="14" aria-hidden="true" />Horario</dt>
        <dd>{{ guarderia.horario_atencion }}</dd>
      </div>
      <div v-if="guarderia.telefono">
        <dt><Phone :size="14" aria-hidden="true" />Teléfono</dt>
        <dd>
          <a v-if="tel" :href="`tel:${tel}`">{{ guarderia.telefono }}</a>
          <template v-else>{{ guarderia.telefono }}</template>
        </dd>
      </div>
      <div v-if="textoDireccion">
        <dt><MapPin :size="14" aria-hidden="true" />Dirección</dt>
        <dd>{{ textoDireccion }}</dd>
      </div>
    </dl>
  </article>
</template>
