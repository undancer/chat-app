import { createPinia } from 'pinia'

export { useCounterStore } from './counter.ts'

export {
  storeToRefs,
} from 'pinia'

const pinia = createPinia()
export default pinia
