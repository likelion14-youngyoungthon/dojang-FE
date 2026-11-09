import arrowRightIcon from '../assets/icons/arrow-right.svg'
import { Button } from './Button'
import { Dialog } from './Dialog'

interface StatusChangeDialogProps {
  serviceName: string
  before: string
  after: string
  evidence: string
  onConfirm: () => void
  onClose: () => void
}

/** 18 상태 변경 확인 모달 */
export function StatusChangeDialog({
  serviceName,
  before,
  after,
  evidence,
  onConfirm,
  onClose,
}: StatusChangeDialogProps) {
  return (
    <Dialog title="이 상태 변경을 반영할까요?" onClose={onClose}>
      <p className="text-[15px] font-bold text-gray-700">{serviceName}</p>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col gap-1 self-stretch rounded-lg bg-gray-50 px-4 py-3.5">
          <p className="text-[13px] text-gray-500">변경 전</p>
          <p className="text-[17px] font-bold">{before}</p>
        </div>
        <img src={arrowRightIcon} alt="에서" width={22} height={22} />
        <div className="flex flex-1 flex-col gap-1 rounded-lg border-[1.5px] border-primary bg-primary-50 px-4 py-3.5">
          <p className="text-[13px] text-gray-500">변경 후</p>
          <p className="text-[17px] font-bold text-primary">{after}</p>
          <p className="text-[12px] text-gray-500">사용자 입력 기준</p>
        </div>
      </div>

      <div className="flex flex-col gap-1 rounded-lg border border-gray-200 px-4 py-3">
        <p className="text-[13px] text-gray-500">근거</p>
        <p className="text-[16px] font-medium">“{evidence}”</p>
      </div>

      <p className="text-[14px] text-gray-500">반영한 뒤에도 신청 단계 카드에서 되돌릴 수 있어요.</p>

      <div className="flex gap-2.5 pt-1">
        <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
          취소
        </Button>
        <Button size="md" className="flex-1" onClick={onConfirm}>
          반영하기
        </Button>
      </div>
    </Dialog>
  )
}
