import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import axios from 'axios'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

import routes from './routes'
import stores from './stores'

import i18n from './legacy/plugins/i18n'

import 'element-plus/dist/index.css'

// import './style.css'

axios.defaults.timeout = 60 * 1000

const app = createApp(App)
for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp)
  app.component(`ElIcon${name}`, comp)
}

app.use(ElementPlus)
app.use(i18n)
app.use(routes)
app.use(stores)
app.config.ignoredElements = [
  /^yt-/,
]
app.mount('#app')
