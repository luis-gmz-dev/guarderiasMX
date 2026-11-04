<script setup lang="ts">
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { sitio } from '@/domain/sitio'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Aviso legal</h1>
    <p>
      Este mapa no es un sitio del IMSS, no forma parte de sus páginas y no lo representa. Los nombres y
      las marcas del IMSS le pertenecen.
    </p>
    <p>
      Los datos salen del directorio público que el IMSS publica en Excel. La copia que ves aquí es la de
      la fecha indicada en el mapa. El archivo de origen está en
      <a :href="sitio.fuenteExcel">{{ sitio.fuenteExcel }}</a>.
    </p>
    <p>
      Una guardería puede cambiar de domicilio, teléfono u horario después de esa fecha. Conviene
      confirmar el dato con la guardería o con el IMSS antes de ir.
    </p>
    <p>Aparecer en este mapa no tiene costo y nadie puede pagar para cambiar su lugar en la lista.</p>
    <BloqueAnuncio />
  </article>
</template>
