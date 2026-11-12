import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  titleId: string
  onClose: () => void
  /** 화면 비율 맞춤 (단계 화면 본문과 같은 0.9배) */
  zoom?: number
  className?: string
  children: ReactNode
}

/**
 * 공통 모달 바탕
 * 열려 있는 동안 뒤 화면(#root)을 inert로 막고 페이지 스크롤을 잠근다. ESC·바깥 클릭으로 닫힘
 */
export function Modal({ titleId, onClose, zoom = 1, className = '', children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const root = document.getElementById('root')
    const { body } = document
    const previousFocus = document.activeElement as HTMLElement | null
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    root?.setAttribute('inert', '')
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`
    panelRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      root?.removeAttribute('inert')
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      previousFocus?.focus?.()
    }
  }, [])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-[rgb(13_18_26/0.55)] p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={{ zoom }}
        className={`w-full rounded-[20px] bg-surface shadow-float focus:outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
