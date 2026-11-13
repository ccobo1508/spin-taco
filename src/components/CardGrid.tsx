import { useEffect, useRef } from 'react'
import { PersonCard } from './PersonCard'
import type { Person } from '../types'

type CardGridProps = {
  available: Person[]
  activeIndex: number
  isSpinning: boolean
  onPlay: () => void
}

export function CardGrid({ available, activeIndex, isSpinning, onPlay }: CardGridProps) {
  const listRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return
    const item = listRef.current.children[activeIndex]
    if (item instanceof HTMLElement) {
      item.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const isEmpty = available.length === 0

  return (
    <section className="board" aria-labelledby="board-title">
      <div className="board-header">
        <h1 id="board-title">Selector de tarjetas</h1>
        <p className="board-count">
          {isEmpty
            ? 'No quedan participantes disponibles'
            : `${available.length} participante${available.length === 1 ? '' : 's'} disponible${available.length === 1 ? '' : 's'}`}
        </p>
        <button
          type="button"
          className="play-button"
          onClick={onPlay}
          disabled={isSpinning || isEmpty}
          aria-label="Iniciar el sorteo"
        >
          {isSpinning ? 'Sorteando…' : 'Play'}
        </button>
      </div>

      {isEmpty ? (
        <p className="board-empty">
          Todas las personas ya fueron seleccionadas. Reinicia el sorteo para volver a jugar.
        </p>
      ) : (
        <ul className="card-grid" ref={listRef} aria-label="Participantes disponibles">
          {available.map((person, index) => (
            <PersonCard key={person.id} person={person} active={index === activeIndex} />
          ))}
        </ul>
      )}
    </section>
  )
}
