import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getKindeClient, login } from '@/services/kindeAuth'

const loadView = (view: string) => () => import(`../views/${view}.vue`)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/callback',
      name: 'callback',
      component: loadView('CallbackView'),
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: loadView('AboutView')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/menu',
      component: loadView('MenuView'),
      meta: { requiresAuth: true },
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
    },
    {
      path: '/profile',
      name: 'profile',
      component: loadView('ProfileView'),
      meta: { requiresAuth: true }
    }
  ]
})

const checkAuthentication = async () => {
  try {
    const kinde = await getKindeClient()
    const user = await kinde.getUser()
    return { authenticated: !!(user && user.id), user }
  } catch (error) {
    console.error('Auth check failed:', error)
    return { authenticated: false, error }
  }
}

const MAX_AUTH_RETRIES = 3
let authRetryCount = 0

router.beforeEach(async (to, from, next) => {
  // Reset retry count when navigating to a new route
  if (from.path !== to.path) {
    authRetryCount = 0
  }

  // Handle callback route
  if (to.path === '/callback') {
    const { authenticated } = await checkAuthentication()
    if (authenticated) {
      next({ path: '/admin/orders', replace: true })
      return
    }
    next()
    return
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { authenticated } = await checkAuthentication()

    if (authenticated) {
      next()
    } else {
      // Prevent infinite loop by checking retry count
      if (authRetryCount >= MAX_AUTH_RETRIES) {
        console.error('Maximum authentication retries reached')
        next({ path: '/', replace: true })
        return
      }

      authRetryCount++
      login({
        app_state: { redirectTo: to.fullPath }
      })
    }
    return
  }

  if (to.path === '/login') {
    login()
    return
  }

  if (to.path === '/') {
    const { authenticated } = await checkAuthentication()

    if (authenticated) {
      next('/admin/orders')
    } else {
      next()
    }
    return
  }

  next()
})

export default router
