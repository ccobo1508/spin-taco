import { useState } from 'react'
import type { Person } from '../types'
import type { AddNameResult } from '../hooks/useRoster'

type NameManagerProps = {
  people: Person[]
  disabled: boolean
  onAdd: (name: string) => AddNameResult
  onRemove: (id: string) => void
  onReset: () => void
}

export function NameManager({ people, disabled, onAdd, onRemove, onReset }: NameManagerProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = onAdd(value)
    if (result.ok) {
      setValue('')
      setError(null)
      return
    }
    setError(result.error)
  }

  return (
    <section className="panel" aria-labelledby="manage-title">
      <h2 id="manage-title">Participantes</h2>

      <form className="name-form" onSubmit={submit} noValidate>
        <label className="visually-hidden" htmlFor="name-input">
          Nombre del participante
        </label>
        <input
          id="name-input"
          className="name-input"
          type="text"
          value={value}
          placeholder="Agregar un nombre"
          autoComplete="off"
          maxLength={40}
          disabled={disabled}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError(null)
          }}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? 'name-error' : undefined}
        />
        <button type="submit" className="ghost-button" disabled={disabled}>
          Agregar
        </button>
      </form>

      {error && (
        <p className="form-error" id="name-error" role="alert">
          {error}
        </p>
      )}

      <ul className="name-list" aria-label="Listado de nombres">
        {people.map((person) => (
          <li key={person.id} className="name-row">
            <span className="name-row-label" title={person.name}>
              {person.name}
            </span>
            <button
              type="button"
              className="icon-button"
              onClick={() => onRemove(person.id)}
              disabled={disabled}
              aria-label={`Eliminar a ${person.name}`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="reset-area">
        {confirmingReset ? (
          <div className="reset-confirm" role="group" aria-label="Confirmar reinicio">
            <span>¿Reiniciar el sorteo?</span>
            <button
              type="button"
              className="ghost-button"
              disabled={disabled}
              onClick={() => {
                onReset()
                setConfirmingReset(false)
              }}
            >
              Sí, reiniciar
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setConfirmingReset(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="ghost-button"
            onClick={() => setConfirmingReset(true)}
            disabled={disabled || people.every((p) => !p.selected)}
          >
            Reiniciar sorteo
          </button>
        )}
      </div>
    </section>
  )
}
