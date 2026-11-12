import arrowRightIcon from '../../assets/icons/arrow-right-16.svg'
import { Modal } from '../Modal'
import { StatusChip } from '../StatusChip'
import { STEP_COUNT, StageBar } from './StageBar'

interface StatusChangeModalProps {
  benefitName: string
  onCancel: () => void
  onConfirm: () => void
}

/** 18 상태 변경 확인 — 심사 대기 중 → 결과 나옴 (확인 뒤 PUT /me/progress) */
export function StatusChangeModal({ benefitName, onCancel, onConfirm }: StatusChangeModalProps) {
  return (
    <Modal titleId="status-change-title" onClose={onCancel} zoom={0.9} className="flex max-w-[480px] flex-col gap-5 p-7">
      <h2 id="status-change-title" className="text-24 font-bold text-text-strong">
        이렇게 바꿀까요?
      </h2>
      <div className="flex flex-col gap-3">
        <p className="text-13 font-medium text-text-sub">{benefitName}</p>
        <div className="flex items-center gap-2">
          <StatusChip status="submitted" />
          <img src={arrowRightIcon} alt="에서" width={16} height={16} />
          <StatusChip status="approved" />
        </div>
        <StageBar filled={STEP_COUNT} />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
        >
          취소
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary px-5 text-15 font-bold text-white hover:bg-primary/90"
        >
          바꾸기
        </button>
      </div>
    </Modal>
  )
}
