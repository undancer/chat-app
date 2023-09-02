import type { RouteLocationNormalized, RouteRecordRaw, RouterHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Default from '../layouts/Default.vue'
import Home from '../views/Home.vue'
import StyleGenerator from '../views/StyleGenerator'
import Help from '../views/Help.vue'
import Room from '../views/Room.vue'

import NotFound from '../views/NotFound.vue'
import Foo from '../views/Foo.vue'
import Bar from '../views/Bar.vue'
import Blank from '../layouts/Blank.vue'
import About from '../views/About.vue'

const history: RouterHistory = createWebHistory()

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Default,
    children: [
      { path: '', component: Home },
      { path: 'stylegen', name: 'stylegen', component: StyleGenerator },
      { path: 'help', name: 'help', component: Help },
    ],
  },
  {
    path: '/room/test',
    name: 'test_room',
    component: Room,
    props: (route: RouteLocationNormalized): Record<string, any> => {
      return { strConfig: route.query }
    },
  },
  {
    path: '/room/:roomId',
    name: 'room',
    component: Room,
    props: (route: RouteLocationNormalized): Record<string, any> => {
      let roomId: number | null = Number.parseInt(route.params.roomId)
      if (Number.isNaN(roomId)) {
        roomId = null
      }
      return { roomId, strConfig: route.query }
    },
  },
  {
    path: '/ui',
    name: 'ui',
    component: Blank,
    children: [
      { path: '', component: About },
      { path: 'foo', component: Foo },
      { path: 'bar', component: Bar },
    ],
  },
  // { path: '*', component: NotFound },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

const router = createRouter({ history, routes })

export default router
