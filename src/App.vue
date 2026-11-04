<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { BookOpen, CircleHelp, Map, Menu, Scale, ShieldCheck, X } from 'lucide-vue-next'
import { sitio } from '@/domain/sitio'

const route = useRoute()
const menuAbierto = ref(false)
const navegacion = ref<HTMLElement | null>(null)
const botonMenu = ref<HTMLButtonElement | null>(null)

watch(() => route.fullPath, () => {
  menuAbierto.value = false
})

function alPulsar(event: KeyboardEvent): void {
  if (event.key === 'Escape') menuAbierto.value = false
}

function alPulsarFuera(event: PointerEvent): void {
  const objetivo = event.target as Node
  if (navegacion.value?.contains(objetivo) || botonMenu.value?.contains(objetivo)) return
  menuAbierto.value = false
}

watch(menuAbierto, (abierto, anterior) => {
  if (abierto) {
    document.addEventListener('keydown', alPulsar)
    document.addEventListener('pointerdown', alPulsarFuera)
    void nextTick(() => {
      navegacion.value?.querySelector('a')?.focus()
    })
    return
  }
  document.removeEventListener('keydown', alPulsar)
  document.removeEventListener('pointerdown', alPulsarFuera)
  if (anterior) botonMenu.value?.focus()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', alPulsar)
  document.removeEventListener('pointerdown', alPulsarFuera)
})
</script>

<template>
  <div class="app">
    <header class="barra">
      <RouterLink to="/" class="marca">
        <img src="/favicon.svg" alt="" width="28" height="28" />
        Mapa de guarderías
      </RouterLink>
      <button
        ref="botonMenu"
        type="button"
        class="menu-boton"
        :aria-expanded="menuAbierto"
        aria-controls="nav-sitio"
        @click="menuAbierto = !menuAbierto"
      >
        <X v-if="menuAbierto" :size="20" aria-hidden="true" />
        <Menu v-else :size="20" aria-hidden="true" />
        <span class="solo-lector">{{ menuAbierto ? 'Cerrar menú' : 'Abrir menú' }}</span>
      </button>
      <nav id="nav-sitio" ref="navegacion" class="nav-sitio" :class="{ abierto: menuAbierto }">
        <RouterLink to="/mapa"><Map :size="16" aria-hidden="true" />Mapa</RouterLink>
        <RouterLink to="/guias"><BookOpen :size="16" aria-hidden="true" />Guías</RouterLink>
        <RouterLink to="/estados"><Map :size="16" aria-hidden="true" />Estados</RouterLink>
        <RouterLink to="/preguntas-frecuentes"><CircleHelp :size="16" aria-hidden="true" />Preguntas frecuentes</RouterLink>
        <RouterLink to="/aviso-legal"><Scale :size="16" aria-hidden="true" />Aviso legal</RouterLink>
        <RouterLink to="/privacidad"><ShieldCheck :size="16" aria-hidden="true" />Privacidad</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView v-slot="{ Component, route: ruta }">
        <Transition name="vista" mode="out-in">
          <component :is="Component" :key="ruta.path" />
        </Transition>
      </RouterView>
    </main>
    <footer class="pie">
      <p>No es un sitio del IMSS.</p>
      <RouterLink to="/mapa">Mapa</RouterLink>
      <RouterLink to="/guias">Guías</RouterLink>
      <RouterLink to="/estados">Estados</RouterLink>
      <a v-if="sitio.correo" :href="`mailto:${sitio.correo}`">{{ sitio.correo }}</a>
    </footer>
  </div>
</template>
