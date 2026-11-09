import { useState } from 'react'
import { DONG_BY_GU, type Gu } from '../data/regions'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { Field } from './Field'
import { GuSegmented } from './GuSegmented'
import { Select } from './Select'

interface RelocationDialogProps {
  initialGu: Gu
  onConfirm: (gu: Gu, dong: string) => void
  onClose: () => void
}

/** 20 거주지 변경 확인 모달 */
export function RelocationDialog({ initialGu, onConfirm, onClose }: RelocationDialogProps) {
  const [gu, setGu] = useState<Gu>(initialGu)
  const [dong, setDong] = useState(DONG_BY_GU[initialGu][0])

  return (
    <Dialog title="어디로 이사하셨나요?" onClose={onClose}>
      <p className="text-[15px] text-gray-700">
        새 거주지를 선택하면 관할 창구와 지역 지원 후보를 다시 계산해요.
      </p>

      <GuSegmented
        size="md"
        value={gu}
        onChange={(next) => {
          setGu(next)
          setDong(DONG_BY_GU[next][0])
        }}
      />

      <Field label="읍면동" htmlFor="relocation-dong">
        <Select
          id="relocation-dong"
          options={DONG_BY_GU[gu]}
          value={dong}
          onChange={(e) => setDong(e.target.value)}
        />
      </Field>

      <p className="rounded-lg bg-gray-50 px-4 py-3 text-[14px] text-gray-700">
        이미 접수한 신청은 그대로 유지돼요. 새 주소지에서 다시 신청해야 하는 지원은 따로 알려 드릴게요.
      </p>

      <div className="flex gap-2.5 pt-1">
        <Button variant="secondary" size="md" className="flex-1" onClick={onClose}>
          취소
        </Button>
        <Button size="md" className="flex-1" onClick={() => onConfirm(gu, dong)}>
          확인
        </Button>
      </div>
    </Dialog>
  )
}
