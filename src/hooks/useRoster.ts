import { useCallback, useEffect, useMemo, useState } from 'react'
import { MAX_NAMES, createPerson } from '../types'
import type { Person } from '../types'
import { defaultRoster, loadRoster, saveRoster } from '../lib/storage'

export type AddNameResult = { ok: true } | { ok: false; error: string }

export function useRoster() {
  const [people, setPeople] = useState<Person[]>(() => loadRoster(defaultRoster()))

  useEffect(() => {
    saveRoster(people)
  }, [people])

  const available = useMemo(() => people.filter((p) => !p.selected), [people])
  const selected = useMemo(() => people.filter((p) => p.selected), [people])

  const addName = useCallback(
    (rawName: string): AddNameResult => {
      const name = rawName.trim()
      if (name.length === 0) {
        return { ok: false, error: 'El nombre no puede estar vacío' }
      }
      if (name.length > 40) {
        return { ok: false, error: 'El nombre no puede superar los 40 caracteres' }
      }
      const normalized = name.toLowerCase()
      if (people.some((p) => p.name.trim().toLowerCase() === normalized)) {
        return { ok: false, error: 'Ese nombre ya está en la lista' }
      }
      if (people.length >= MAX_NAMES) {
        return { ok: false, error: `El listado admite hasta ${MAX_NAMES} nombres` }
      }
      setPeople((current) => [...current, createPerson(name)])
      return { ok: true }
    },
    [people],
  )

  const removeName = useCallback((id: string) => {
    setPeople((current) => current.filter((p) => p.id !== id))
  }, [])

  const markSelected = useCallback((id: string) => {
    setPeople((current) =>
      current.map((p) => (p.id === id ? { ...p, selected: true } : p)),
    )
  }, [])

  const reset = useCallback(() => {
    setPeople((current) => current.map((p) => ({ ...p, selected: false })))
  }, [])

  return { people, available, selected, addName, removeName, markSelected, reset }
}
