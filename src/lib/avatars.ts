export const AVATAR_COUNT = 25

function hashName(name: string): number {
  const normalized = name.trim().toLowerCase()
  let hash = 0x811c9dc5
  for (let i = 0; i < normalized.length; i += 1) {
    hash ^= normalized.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function avatarFor(name: string): string {
  const index = (hashName(name) % AVATAR_COUNT) + 1
  return `/avatars/avatar-${String(index).padStart(2, '0')}.svg`
}
