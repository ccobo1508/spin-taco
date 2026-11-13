import type { Person } from '../types'

export const SPIN_DURATION_MS = 4200
export const MIN_INTERVAL_MS = 60
export const MAX_INTERVAL_MS = 420

export function pickWinnerIndex(available: Person[], random: () => number = Math.random): number {
  return Math.floor(random() * available.length)
}

export function easeOutQuart(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress))
  return 1 - (1 - clamped) ** 4
}

export function intervalFor(elapsedMs: number, durationMs = SPIN_DURATION_MS): number {
  const progress = durationMs <= 0 ? 1 : elapsedMs / durationMs
  return MIN_INTERVAL_MS + (MAX_INTERVAL_MS - MIN_INTERVAL_MS) * easeOutQuart(progress)
}

export function nextStep(currentIndex: number, count: number, random: () => number = Math.random): number {
  if (count <= 1) return 0
  const step = 1 + Math.floor(random() * 3)
  return (currentIndex + step) % count
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
