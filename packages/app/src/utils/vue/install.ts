import type { App } from 'vue'
import type { SFCWithInstall } from '../types.ts'

export function withInstall<T, E extends Record<string, any>>(main: T, extra?: E): T {
  (main as SFCWithInstall<T>).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }
  return main
}
