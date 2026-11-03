<script setup lang="ts">
import { onMounted } from 'vue'
import { sitio } from '@/domain/sitio'

onMounted(() => {
  const ventana = window as Window & { adsbygoogle?: Record<string, unknown>[] }
  ventana.adsbygoogle = ventana.adsbygoogle || []
  try {
    ventana.adsbygoogle.push({})
  } catch {
    // AdSense rechaza un segundo push si el bloque ya se pidió.
  }
})
</script>

<template>
  <aside class="anuncio" aria-label="Anuncio">
    <ins
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="sitio.adsense"
      :data-ad-slot="sitio.anuncioSlot || undefined"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </aside>
</template>
