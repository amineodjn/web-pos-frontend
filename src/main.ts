import './main.css'
import i18n from './i18n'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import authService from './services/auth'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

const initApp = async () => {
  try {
    await authService.isAuthenticated()
    app.mount('#app')
  } catch (error) {
    console.error('Failed to initialize auth:', error)
    app.mount('#app')
  }
}

initApp()
