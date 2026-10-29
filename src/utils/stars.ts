import { mulberry32 } from './random'

/** A fixed, seeded set of tiny stars expressed as stacked radial gradients. */
export function makeStars(count: number, seed: number, color: string, maxSize: number) {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, () => {
    const x = (rand() * 100).toFixed(1)
    const y = (rand() * 100).toFixed(1)
    const s = (1 + rand() * (maxSize - 1)).toFixed(1)
    return `radial-gradient(${s}px ${s}px at ${x}% ${y}%, ${color}, transparent)`
  }).join(',')
}
