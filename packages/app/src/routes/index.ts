import type { RouteRecordRaw, RouterHistory } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

import Default from '../layouts/Default.vue'
import Home from '../views/Home.vue'
import StyleGenerator from '../views/StyleGenerator/index.vue'
import Help from '../views/Help.vue'
import Room from '../views/Room.vue'

import NotFound from '../views/NotFound.vue'
import Foo from '../views/Foo.vue'

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
    props: (route) => {
      return { strConfig: route.query }
    },
  },
  {
    path: '/room/:roomId',
    name: 'room',
    component: Room,
    props: (route) => {
      let roomId: number | null = Number.parseInt(route.params.roomId)
      if (Number.isNaN(roomId)) {
        roomId = null
      }
      return { roomId, strConfig: route.query }
    },
  },
  {
    path: '/foo',
    name: 'foo',
    component: Foo,
  },
  // { path: '*', component: NotFound },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({ history, routes })

export default router
