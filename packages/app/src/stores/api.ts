import { defineStore } from 'pinia'
import { useWebSocket } from '@vueuse/core'

export const useApiStore = defineStore('api', {
  state: (): { conn?: WebSocket } => {
    return {
      conn: null,
    }
  },
  actions: {
    foo() {
      this.conn = new WebSocket('')
      console.log('foo')
    },
    bar() {
      this.conn.sendMessage('')
      const {
        data, send, open,
        close,
      } = useWebSocket('ws://websocketurl')

      send(`???${data.value}`)
      open()
      close()

      console.log('bar')
    },
  },

})
