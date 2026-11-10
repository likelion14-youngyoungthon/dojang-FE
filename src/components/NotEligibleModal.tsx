import { useRef } from 'react'
import warningIcon from '../assets/icons/warning.svg'
import { Button } from './Button'
import { ModalOverlay } from './ModalOverlay'

interface NotEligibleModalProps {
  onReselect: () => void
  onClose: () => void
}

/** 02 비대상 안내 화면 (Figma: Modal / 비대상 안내) */
export function NotEligibleModal({ onReselect, onClose }: NotEligibleModalProps) {
  const primaryRef = useRef<HTMLButtonElement>(null)

  return (
    <ModalOverlay
      onClose={onClose}
      initialFocusRef={primaryRef}
      labelledBy="not-eligible-title"
      className="flex max-w-[440px] flex-col items-center gap-6 px-9 pt-9 pb-8"
    >
      <img src={warningIcon} alt="" width={40} height={40} />

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 id="not-eligible-title" className="text-[22px] leading-[1.35] font-bold">
          용인시 거주자만 이용 가능해요
        </h2>
        <p className="text-[15px] leading-[1.6] text-gray-700">
          이 서비스는 용인시에 거주하는 등록장애인을 위한
          <br />
          서비스예요. 거주지를 다시 확인하고 시작해 주세요.
        </p>
      </div>

      <div className="flex w-full flex-col gap-2.5">
        <Button ref={primaryRef} size="md" onClick={onReselect}>
          거주지 다시 선택
        </Button>
        <Button variant="secondary" size="md" onClick={onClose}>
          닫기
        </Button>
      </div>
    </ModalOverlay>
  )
}
