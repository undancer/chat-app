export function mergeConfig(config, defaultConfig) {
  const res = {}
  for (const i in defaultConfig) {
    res[i] = i in config ? config[i] : defaultConfig[i]
  }
  return res
}

export function toBool(val: any): boolean {
  if (typeof val === 'string') {
    return !['false', 'no', 'off', '0', ''].includes(val.toLowerCase())
  }
  return Boolean(val)
}

export function toInt(val: string, _default: number): number {
  let res: number = Number.parseInt(val)
  if (Number.isNaN(res)) {
    res = _default
  }
  return res
}

export function formatCurrency(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: price < 100 ? 2 : 0,
  }).format(price)
}

export function getTimeTextHourMin(date: Date): string {
  const hour: number = date.getHours()
  const min: string = `00${date.getMinutes()}`.slice(-2)
  return `${hour}:${min}`
}

export function getUuid4Hex(): string {
  const chars = []
  for (let i = 0; i < 32; i++) {
    const char = Math.floor(Math.random() * 16).toString(16)
    chars.push(char)
  }
  return chars.join('')
}
