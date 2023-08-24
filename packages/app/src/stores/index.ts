import { createPinia } from 'pinia'

export { useCounterStore } from './counter'

export {
  storeToRefs,
} from 'pinia'

const pinia = createPinia()
export default pinia
