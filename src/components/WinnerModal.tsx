import { useEffect, useRef } from 'react'
import { avatarFor } from '../lib/avatars'
import type { Person } from '../types'

type WinnerModalProps = {
  winner: Person | null
  onClose: () => void
}

export function WinnerModal({ winner, onClose }: WinnerModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const supportsDialog = typeof HTMLDialogElement !== 'undefined'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!winner) return
    if (supportsDialog && dialog && !dialog.open) {
      dialog.showModal()
    }
    closeButtonRef.current?.focus()
    return () => {
      if (supportsDialog && dialog?.open) {
        dialog.close()
      }
    }
  }, [winner, supportsDialog])

  if (!winner) return null

  const content = (
    <>
      <img
        className="winner-avatar"
        src={avatarFor(winner.name)}
        alt=""
        width="96"
        height="96"
      />
      <p className="winner-kicker">¡Felicitaciones!</p>
      <p className="winner-name" id="winner-name">
        {winner.name}
      </p>
      <p className="winner-copy">Has sido la persona seleccionada.</p>
      <button
        type="button"
        className="play-button"
        onClick={onClose}
        ref={closeButtonRef}
      >
        Cerrar
      </button>
    </>
  )

  if (!supportsDialog) {
    return (
      <div className="modal-overlay" role="presentation" onClick={onClose}>
        <div
          className="winner-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="winner-name"
          onClick={(event) => event.stopPropagation()}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className="winner-modal"
      aria-labelledby="winner-name"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose()
      }}
    >
      {content}
    </dialog>
  )
}
