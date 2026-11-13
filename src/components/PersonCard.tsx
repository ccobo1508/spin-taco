import { avatarFor } from '../lib/avatars'
import type { Person } from '../types'

type PersonCardProps = {
  person: Person
  active: boolean
}

export function PersonCard({ person, active }: PersonCardProps) {
  return (
    <li
      className={active ? 'person-card is-active' : 'person-card'}
      aria-current={active ? 'true' : undefined}
    >
      <img className="person-avatar" src={avatarFor(person.name)} alt="" width="64" height="64" />
      <span className="person-name" title={person.name}>
        {person.name}
      </span>
      <span className="person-state">Disponible</span>
    </li>
  )
}
