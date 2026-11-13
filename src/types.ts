export type Person = {
  id: string
  name: string
  selected: boolean
}

export type RosterState = {
  people: Person[]
}

export const STORAGE_KEY = 'spin-taco:roster:v1'

export const MAX_NAMES = 40

export const DEFAULT_NAMES: string[] = [
  'Ana Torres',
  'Bruno Díaz',
  'Carla Ruiz',
  'Diego Paz',
  'Elena Mora',
  'Fabián Soto',
  'Gabriela Luna',
  'Hugo Vera',
  'Irene Gil',
  'Javier Ríos',
  'Karen Vidal',
  'Lucas Peña',
  'Marina Cruz',
  'Nicolás Rey',
  'Olivia Cano',
  'Pablo León',
  'Quimey Rojas',
  'Rocío Sosa',
  'Sergio Navas',
  'Tamara Vega',
]

export function createPerson(name: string): Person {
  return { id: createId(), name, selected: false }
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
}
