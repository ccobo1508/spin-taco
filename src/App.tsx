import { useState } from 'react'
import { CardGrid } from './components/CardGrid'
import { NameManager } from './components/NameManager'
import { PeopleLists } from './components/PeopleLists'
import { WinnerModal } from './components/WinnerModal'
import { useRoster } from './hooks/useRoster'
import { useHighlightSpin } from './hooks/useHighlightSpin'
import './App.css'

function App() {
  const { people, available, selected, addName, removeName, markSelected, reset } = useRoster()
  const { activeIndex, isSpinning, winner, start, clearWinner } = useHighlightSpin()
  const [announcement, setAnnouncement] = useState('')

  const handlePlay = () => {
    const result = start(available)
    if (result) setAnnouncement('')
  }

  const handleCloseModal = () => {
    if (winner) {
      markSelected(winner.id)
      setAnnouncement(`Seleccionado: ${winner.name}`)
    }
    clearWinner()
  }

  const handleReset = () => {
    reset()
    clearWinner()
    setAnnouncement('Sorteo reiniciado')
  }

  const handleRemove = (id: string) => {
    removeName(id)
    if (winner?.id === id) clearWinner()
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="app-kicker">Spin Taco</p>
        <h1 className="app-title">¿Quién sigue?</h1>
        <p className="app-subtitle">
          Presiona Play y mira cómo se iluminan las tarjetas hasta elegir a una persona al azar.
        </p>
      </header>

      <p className="visually-hidden" role="status" aria-live="polite">
        {announcement}
      </p>

      <CardGrid
        available={available}
        activeIndex={activeIndex}
        isSpinning={isSpinning}
        onPlay={handlePlay}
      />

      <div className="app-columns">
        <NameManager
          people={people}
          disabled={isSpinning}
          onAdd={addName}
          onRemove={handleRemove}
          onReset={handleReset}
        />
        <PeopleLists people={people} selected={selected} />
      </div>

      <WinnerModal winner={winner} onClose={handleCloseModal} />
    </main>
  )
}

export default App
