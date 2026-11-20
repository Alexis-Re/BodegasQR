import { createRouter, createWebHistory } from 'vue-router'
import SimpleTenantPage from '../pages/SimpleTenantPage.vue'
import TenantLandingPage from '../pages/TenantLandingPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/bodega/bodega-aurora/registro'
    },
    {
      path: '/bodega/:slug',
      name: 'tenant-landing',
      component: TenantLandingPage
    },
    {
      path: '/bodega/:slug/registro',
      name: 'tenant-registration',
      component: SimpleTenantPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundPage
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    return { top: 0, behavior: 'smooth' }
  }
})

export default router
