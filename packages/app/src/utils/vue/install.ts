import type { App, Plugin } from 'vue'

export function withInstall<T, E extends Record<string, any>>(main: T, extra?: E) {
  (main as (T & Plugin)).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra ?? {})]) {
      app.component(comp.name, comp)
    }
  }
  return main
}
