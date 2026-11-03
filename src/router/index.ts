import { createRouter, createWebHistory } from 'vue-router'
import { sitio } from '@/domain/sitio'
import MapView from '@/views/MapView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    titulo?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'mapa', component: MapView },
    { path: '/admin', redirect: '/' },
    {
      path: '/aviso-legal',
      name: 'aviso-legal',
      component: () => import('@/views/AvisoLegal.vue'),
      meta: { titulo: 'Aviso legal' },
    },
    {
      path: '/privacidad',
      name: 'privacidad',
      component: () => import('@/views/AvisoPrivacidad.vue'),
      meta: { titulo: 'Privacidad' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = to.meta.titulo ? `${to.meta.titulo} · ${sitio.nombre}` : sitio.nombre
})

export default router
