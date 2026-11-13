import { avatarFor } from '../lib/avatars'
import type { Person } from '../types'

type PeopleListsProps = {
  people: Person[]
  selected: Person[]
}

export function PeopleLists({ people, selected }: PeopleListsProps) {
  return (
    <section className="lists" aria-labelledby="lists-title">
      <h2 id="lists-title">Estado del sorteo</h2>
      <div className="lists-columns">
        <div className="list-block">
          <h3>Listado total ({people.length})</h3>
          {people.length === 0 ? (
            <p className="list-empty">Todavía no hay nombres en la lista.</p>
          ) : (
            <ul className="status-list" aria-label="Listado total de nombres">
              {people.map((person) => (
                <li key={person.id} className="status-row">
                  <img
                    className="status-avatar"
                    src={avatarFor(person.name)}
                    alt=""
                    width="28"
                    height="28"
                  />
                  <span className="status-name" title={person.name}>
                    {person.name}
                  </span>
                  <span className={person.selected ? 'badge is-selected' : 'badge'}>
                    {person.selected ? 'Seleccionado' : 'Disponible'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="list-block">
          <h3>Seleccionados ({selected.length})</h3>
          {selected.length === 0 ? (
            <p className="list-empty">Nadie ha sido seleccionado todavía.</p>
          ) : (
            <ol className="status-list selected-list" aria-label="Personas seleccionadas">
              {selected.map((person) => (
                <li key={person.id} className="status-row">
                  <img
                    className="status-avatar"
                    src={avatarFor(person.name)}
                    alt=""
                    width="28"
                    height="28"
                  />
                  <span className="status-name" title={person.name}>
                    {person.name}
                  </span>
                  <span className="badge is-selected">Seleccionado</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  )
}
