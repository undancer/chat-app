import VueRouter from 'vue-router3'
import Layout from '@/layout/index.vue'
import Home from '@/views/Home.vue'
import StyleGenerator from '@/views/StyleGenerator/index.vue'
import Help from '@/views/Help.vue'
import Room from '@/views/Room.vue'
import NotFound from '@/views/NotFound.vue'

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
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
      props: route => ({ strConfig: route.query }),
    },
    {
      path: '/room/:roomId',
      name: 'room',
      component: Room,
      props(route) {
        let roomId = Number.parseInt(route.params.roomId)
        if (isNaN(roomId)) {
          roomId = null
        }
        return { roomId, strConfig: route.query }
      },
    },
    { path: '*', component: NotFound },
  ],
})

export default router
