import { createPinia } from 'pinia'

const pinia = createPinia()
export default pinia

// export {
//   storeToRefs,
//   mapActions,
// } from 'pinia'

export * from 'pinia'
export * from './api'
export * from './counter'
