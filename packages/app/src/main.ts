import { createApp } from 'vue'
import App from './App.vue'
import routes from './routes'
import stores from './stores'

// import './style.css'

const app = createApp(App)
app.use(routes)
app.use(stores)
app.mount('#app')
