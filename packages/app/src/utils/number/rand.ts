export function randInt(min: number, max: number): number {
  return Math.floor(min + ((max - min + 1) * Math.random()))
}
