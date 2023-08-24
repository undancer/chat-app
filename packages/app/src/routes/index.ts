import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const history = createWebHistory()
// const history = createMemoryHistory();

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../components/Home.vue'),
  },
  {
    name: 'counter',
    path: '/hello-world',
    // path: '/',
    component: () => import('../components/HelloWorld.vue'),
    props: {
      msg: 'msg',
    },
  },
]

const router = createRouter({
  history,
  routes,
})

export default router
