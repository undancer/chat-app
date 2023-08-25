import Vue from 'vue'
import VueRouter from 'vue-router'
import {
  Message,
} from 'element-ui'
import axios from 'axios'

import * as i18n from './plugins/i18n/legacy.ts'
import App from './App.vue'
import router from './routes/legacy'

import './plugins/utils'

axios.defaults.timeout = 60 * 1000;

((app: { use(a: any): void }) => {
  app.use(VueRouter)
})(Vue)

Vue.prototype.$message = Message

Vue.config.ignoredElements = [
  /^yt-/,
]

// createApp(App).config.isCustomElement

new Vue({
  render: h => h(App),
  router,
  i18n: i18n.i18n,
}).$mount('#app')
