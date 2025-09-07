import './main.css'
import i18n from './i18n'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuth } from './composables/useAuth'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

const initApp = async () => {
  try {
    const { initializeAuth } = useAuth()
    const isAuth = await initializeAuth()
    app.mount('#app')

    if (isAuth) {
      const { getStoredRedirect } = useAuth()
      const redirectUrl = getStoredRedirect()
      if (redirectUrl) {
        router.push(redirectUrl)
      }
    }
  } catch (error) {
    console.error('Failed to initialize auth:', error)
    app.mount('#app')
  }
}

initApp()
