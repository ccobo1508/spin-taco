import { useCallback, useEffect, useRef, useState } from 'react'
import type { Person } from '../types'
import {
  SPIN_DURATION_MS,
  intervalFor,
  nextStep,
  pickWinnerIndex,
  prefersReducedMotion,
} from '../lib/picker'

type SpinState = {
  activeIndex: number
  isSpinning: boolean
  winner: Person | null
}

export function useHighlightSpin() {
  const [state, setState] = useState<SpinState>({
    activeIndex: -1,
    isSpinning: false,
    winner: null,
  })

  const frameRef = useRef<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const mountedRef = useRef(true)
  const spinningRef = useRef(false)

  const clearScheduled = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      spinningRef.current = false
      clearScheduled()
    }
  }, [clearScheduled])

  const start = useCallback(
    (available: Person[]): Person | null => {
      if (spinningRef.current || available.length === 0) return null
      clearScheduled()

      const winnerIndex = pickWinnerIndex(available)
      const winner = available[winnerIndex]
      let settled = false

      const settle = (index: number) => {
        if (settled) return
        settled = true
        spinningRef.current = false
        clearScheduled()
        if (!mountedRef.current) return
        setState({ activeIndex: index, isSpinning: false, winner })
      }

      if (prefersReducedMotion()) {
        spinningRef.current = false
        setState({ activeIndex: winnerIndex, isSpinning: false, winner })
        return winner
      }

      spinningRef.current = true
      const startedAt = performance.now()
      let lastAdvance = startedAt
      let currentIndex = nextStep(-1, available.length)

      setState({ activeIndex: currentIndex, isSpinning: true, winner: null })

      const tick = (now: number) => {
        if (!mountedRef.current) {
          clearScheduled()
          return
        }
        const elapsed = now - startedAt

        if (elapsed >= SPIN_DURATION_MS) {
          settle(winnerIndex)
          return
        }

        if (now - lastAdvance >= intervalFor(elapsed)) {
          lastAdvance = now
          const remaining = SPIN_DURATION_MS - elapsed
          const stepsLeft = Math.ceil(remaining / intervalFor(elapsed))
          currentIndex = stepsLeft <= 1 ? winnerIndex : nextStep(currentIndex, available.length)
          setState((current) => ({ ...current, activeIndex: currentIndex }))
        }

        frameRef.current = requestAnimationFrame(tick)
      }

      frameRef.current = requestAnimationFrame(tick)
      timerRef.current = window.setTimeout(() => settle(winnerIndex), SPIN_DURATION_MS + 200)

      return winner
    },
    [clearScheduled],
  )

  const clearWinner = useCallback(() => {
    setState({ activeIndex: -1, isSpinning: false, winner: null })
  }, [])

  const cancel = useCallback(() => {
    spinningRef.current = false
    clearScheduled()
    setState({ activeIndex: -1, isSpinning: false, winner: null })
  }, [clearScheduled])

  return { ...state, start, cancel, clearWinner }
}
