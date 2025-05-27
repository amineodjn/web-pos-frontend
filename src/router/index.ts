import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authService from '../services/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/menu',
      component: () => import('../views/MenuView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'menu',
          name: 'admin-menu',
          component: () => import('../views/MenuView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/OrdersView.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'kitchen',
          name: 'admin-kitchen',
          component: () => import('../views/KitchenView.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  const isAuthenticated = await authService.isAuthenticated()
  const appState = {
    redirectTo: to.fullPath
  }
  if (!isAuthenticated) {
    await authService.login(appState)
    return
  }

  next()
})

export default router
