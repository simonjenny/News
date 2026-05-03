import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Register the service worker for auto updates with periodic checks
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 10 * 60 * 1000 // Check every 10 minutes

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, r) {
    r && setInterval(async () => {
      if (r.installing || !navigator)
        return

      if (('connection' in navigator) && !navigator.onLine)
        return

      const resp = await fetch(swUrl, {
        cache: 'no-store',
        headers: {
          'cache': 'no-store',
          'cache-control': 'no-cache',
        },
      })

      if (resp?.status === 200)
        await r.update()
    }, intervalMS)
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
