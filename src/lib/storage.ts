import { DEFAULT_NAMES, STORAGE_KEY, createPerson } from '../types'
import type { Person } from '../types'

function isPerson(value: unknown): value is Person {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    candidate.id.length > 0 &&
    typeof candidate.name === 'string' &&
    candidate.name.trim().length > 0 &&
    typeof candidate.selected === 'boolean'
  )
}

export function defaultRoster(): Person[] {
  return DEFAULT_NAMES.map(createPerson)
}

export function loadRoster(fallback: Person[]): Person[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback

    const parsed: unknown = JSON.parse(raw)
    const list = Array.isArray(parsed)
      ? parsed
      : typeof parsed === 'object' && parsed !== null && Array.isArray((parsed as { people?: unknown }).people)
        ? (parsed as { people: unknown[] }).people
        : null

    if (!list) return fallback

    const valid = list.filter(isPerson)
    return valid.length > 0 ? valid : fallback
  } catch {
    return fallback
  }
}

export function saveRoster(people: Person[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ people }))
  } catch {
    // Storage unavailable (private mode, quota); state stays in memory.
  }
}
