import { useId, type ReactNode } from 'react'
import closeIcon from '../assets/icons/close.svg'
import { ModalOverlay } from './ModalOverlay'

interface DialogProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** 제목 + 닫기 버튼이 있는 520px 모달 (Figma: Modal — 18·20 화면) */
export function Dialog({ title, onClose, children }: DialogProps) {
  const titleId = useId()

  return (
    <ModalOverlay
      onClose={onClose}
      align="top"
      labelledBy={titleId}
      className="flex max-w-[520px] flex-col gap-5 px-8 py-7"
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
    </ModalOverlay>
  )
}
