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
  // Handle callback route - always allow it through
  if (to.path === '/callback') {
    next()
    return
  }

  // Handle explicit login route
  if (to.path === '/login') {
    // Store the intended redirect in session storage
    const redirectTo = (to.query.redirect_to as string) || '/admin/orders'
    sessionStorage.setItem('auth_redirect_to', redirectTo)

    await login({
      app_state: { redirectTo }
    })
    return
  }

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { authenticated } = await checkAuthentication()

    if (authenticated) {
      next()
    } else {
      // Store the intended destination
      sessionStorage.setItem('auth_redirect_to', to.fullPath)

      // Redirect to login
      await login({
        app_state: { redirectTo: to.fullPath }
      })
    }
    return
  }

  // All other routes
  next()
})

export default router
