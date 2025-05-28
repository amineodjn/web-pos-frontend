import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import HomeView from '../views/HomeView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const loadView = (view: string) => {
  return () => import(`../views/${view}.vue`)
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: loadView('AboutView')
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      meta: { requiresAuth: true },
      redirect: '/admin/orders',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: loadView('DashboardView'),
          meta: { requiresAuth: true }
        },
        {
          path: 'menu',
          name: 'admin-menu',
          component: loadView('MenuView'),
          meta: { requiresAuth: true }
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: loadView('OrdersView'),
          meta: { requiresAuth: true }
        },
        {
          path: 'kitchen',
          name: 'admin-kitchen',
          component: loadView('KitchenView'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth, getStoredRedirect, clearStoredRedirect } = useAuth()

  if (!to.meta.requiresAuth) {
    const storedRedirect = getStoredRedirect()
    if (storedRedirect && to.name === 'home') {
      clearStoredRedirect()
      return next(storedRedirect)
    }
    return next()
  }

  const isAuthenticated = await checkAuth()
  if (!isAuthenticated) {
    localStorage.setItem('auth_redirect', to.fullPath)
    return next({ name: 'home' })
  }

  return next()
})

export default router
