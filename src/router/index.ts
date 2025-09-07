import { createRouter, createWebHistory } from 'vue-router'
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
      redirect: '/admin/orders',
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: loadView('DashboardView')
        },
        {
          path: 'menu',
          name: 'admin-menu',
          component: loadView('MenuView')
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: loadView('OrdersView')
        },
        {
          path: 'kitchen',
          name: 'admin-kitchen',
          component: loadView('KitchenView')
        }
      ]
    }
  ]
})


export default router
