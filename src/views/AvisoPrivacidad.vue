<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BloqueAnuncio from '@/components/anuncios/BloqueAnuncio.vue'
import { sitio } from '@/domain/sitio'
</script>

<template>
  <article class="pagina-aviso">
    <h1>Privacidad</h1>
    <p class="entradilla">
      Este mapa no abre cuentas. No te pide nombre, correo ni teléfono para consultar el directorio.
    </p>
    <ul>
      <li>La búsqueda se hace en tu navegador. No hay un perfil tuyo en este sitio.</li>
      <li>La ubicación, si la permites, no sale de tu equipo.</li>
      <li>Las cookies que pueden aparecer son las del anuncio de Google, no una sesión de este mapa.</li>
      <li>Bloquear cookies no impide consultar el directorio.</li>
    </ul>

    <h2>Qué datos trata este sitio</h2>
    <p>
      La consulta ocurre en tu navegador. La búsqueda, el estado y el municipio que eliges no se guardan
      en una cuenta de este mapa, porque no hay cuentas.
    </p>
    <p>
      Si pulsas <strong>Mi ubicación</strong>, el navegador pide permiso y usa ese dato solo en tu equipo
      para calcular distancias y ordenar la lista. No se envía a un servidor de este mapa. Si niegas el
      permiso, la búsqueda sigue disponible sin distancias.
    </p>
    <p>
      El hospedaje puede registrar datos técnicos de la conexión, como la dirección IP y el tipo de
      navegador, para entregar la página y proteger el servicio. Este mapa no usa ese registro para
      identificarte ni para armar un perfil.
    </p>

    <h2>Por qué hay cookies</h2>
    <p>
      Este mapa no instala cookies propias para recordar una sesión, porque no hay inicio de sesión. Las
      cookies que pueden aparecer vienen de la publicidad.
    </p>
    <p>
      El listado y las páginas de texto pueden mostrar un anuncio de Google AdSense, cuenta
      {{ sitio.adsense }}. Google puede guardar cookies para medir el anuncio, limitar cuántas veces se
      muestra y elegir uno según su propia política. Esas cookies no cambian los datos ni el orden de las
      guarderías.
    </p>
    <p>
      La explicación de Google está en su
      <a href="https://policies.google.com/privacy">política de privacidad</a>
      y en
      <a href="https://policies.google.com/technologies/ads">cómo usa las cookies de publicidad</a>.
      Puedes revisar o limitar los anuncios personalizados en
      <a href="https://adssettings.google.com">la configuración de anuncios de Google</a>.
    </p>

    <h2>Cómo limitar las cookies</h2>
    <p>
      Puedes borrar o bloquear las cookies desde la configuración de tu navegador. Si las bloqueas, el
      mapa se sigue consultando. Es posible que el espacio del anuncio quede vacío.
    </p>

    <h2>Contacto</h2>
    <p v-if="sitio.correo">
      Para una duda sobre este aviso:
      <a :href="`mailto:${sitio.correo}`">{{ sitio.correo }}</a>
    </p>
    <p v-else>
      El correo de contacto se publicará aquí antes de ofrecer el sitio al público. Mientras tanto, el
      alcance del sitio está en el
      <RouterLink to="/aviso-legal">aviso legal</RouterLink>.
    </p>
    <BloqueAnuncio />
  </article>
</template>
