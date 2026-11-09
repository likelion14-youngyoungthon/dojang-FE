import { useEffect, useId, useRef, type ReactNode } from 'react'
import closeIcon from '../assets/icons/close.svg'

interface DialogProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** 제목 + 닫기 버튼이 있는 520px 모달 (Figma: Modal — 18·20 화면) */
export function Dialog({ title, onClose, children }: DialogProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-dim p-4 pt-[15vh]"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full max-w-[520px] flex-col gap-5 rounded-xl bg-white px-8 py-7 focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-[22px] leading-[1.35] font-bold">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="닫기" className="rounded hover:bg-gray-50">
            <img src={closeIcon} alt="" width={22} height={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
