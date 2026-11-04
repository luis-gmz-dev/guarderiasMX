import { createRouter, createWebHistory } from 'vue-router'
import { asegurarAdsense } from '@/domain/adsense'
import { aplicarSeo } from '@/domain/seo'
import MapView from '@/views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'mapa', component: MapView },
    { path: '/admin', redirect: '/' },
    {
      path: '/guias',
      name: 'guias',
      component: () => import('@/views/GuiasIndex.vue'),
    },
    {
      path: '/guias/:slug',
      name: 'guia',
      component: () => import('@/views/GuiaDetalle.vue'),
    },
    {
      path: '/estados',
      name: 'estados',
      component: () => import('@/views/EstadosIndex.vue'),
    },
    {
      path: '/estados/:slug',
      name: 'estado',
      component: () => import('@/views/EstadoDetalle.vue'),
    },
    {
      path: '/municipios/:estado/:municipio',
      name: 'municipio',
      component: () => import('@/views/MunicipioDetalle.vue'),
    },
    {
      path: '/preguntas-frecuentes',
      name: 'preguntas',
      component: () => import('@/views/PreguntasFrecuentes.vue'),
    },
    {
      path: '/aviso-legal',
      name: 'aviso-legal',
      component: () => import('@/views/AvisoLegal.vue'),
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: () => import('@/views/AvisoPrivacidad.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  aplicarSeo(to.path)
  asegurarAdsense()
})

export default router
