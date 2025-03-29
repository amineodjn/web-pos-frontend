import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/menu',
      component: () => import('../views/MenuView.vue'),
      meta: {
        requiresAuth: true // In a real app, this would be used for authentication
      },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/DashboardView.vue')
        },
        {
          path: 'menu',
          name: 'admin-menu',
          component: () => import('../views/MenuView.vue')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: () => import('../views/OrdersView.vue')
        }
      ]
    }
  ]
})

// In a real application, you would add a navigation guard for authentication
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // Check if user is authenticated
//     // if (!isAuthenticated) {
//     //   next({ name: 'login' })
//     // } else {
//     //   next()
//     // }
//   } else {
//     next()
//   }
// })

export default router
