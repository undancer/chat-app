// function _init() {
//   // const ws = new WebSocket(urlRef.value, protocols)
//   const ws: WebSocket = new WebSocket('', 'ws')
//   ws.onopen = (ev: Event) => {
//     console.log(`e${ev}`)
//   }
// }

import { defineStore } from 'pinia'

export const useWSStore = defineStore<'ws', { ws: WebSocket }>('ws', {

  state: () => {
    return { ws: new WebSocket('', '') }
  },

  actions: {

    foo() {
      this.ws.send('???')
    },

  },

})
