import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { createPortal } from 'react-dom'

interface ModalOverlayProps {
  onClose: () => void
  /** 열릴 때 포커스를 줄 요소. 없으면 패널 자체에 포커스 */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** 패널 정렬: center(02 화면), top(18·20 화면) */
  align?: 'center' | 'top'
  labelledBy: string
  className?: string
  children: ReactNode
}

/**
 * 모든 모달의 공통 바탕.
 * 열려 있는 동안 뒤 화면(#root)을 inert로 만들어 클릭·키보드 포커스·화면낭독기 접근을 막고,
 * 페이지 스크롤을 잠근다. 닫히면 원래 상태와 포커스를 되돌린다.
 */
export function ModalOverlay({
  onClose,
  initialFocusRef,
  align = 'center',
  labelledBy,
  className = '',
  children,
}: ModalOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // 뒤 화면 잠금 + 스크롤 잠금
  useEffect(() => {
    const root = document.getElementById('root')
    const { body } = document
    const previousFocus = document.activeElement as HTMLElement | null
    const prevOverflow = body.style.overflow
    const prevPaddingRight = body.style.paddingRight
    // 스크롤바가 사라지면서 화면이 옆으로 밀리지 않도록 그 폭만큼 여백을 채움
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    root?.setAttribute('inert', '')
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`

    return () => {
      root?.removeAttribute('inert')
      body.style.overflow = prevOverflow
      body.style.paddingRight = prevPaddingRight
      previousFocus?.focus?.()
    }
  }, [])

  // 첫 포커스는 열릴 때 한 번만 (리렌더마다 포커스를 뺏지 않도록)
  useEffect(() => {
    ;(initialFocusRef?.current ?? panelRef.current)?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ESC로 닫기 — 최신 onClose를 ref로 참조
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex justify-center overflow-y-auto overscroll-contain bg-dim p-4 ${
        align === 'center' ? 'items-center' : 'items-start pt-[15vh]'
      }`}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className={`w-full rounded-xl bg-white focus:outline-none ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
