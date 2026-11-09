import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card, InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { CheckboxTileGroup, RadioTileGroup } from '../components/OptionTile'

const BENEFIT_STATUS = ['기초생활수급자', '차상위계층', '해당 없음'] as const
const RECEIVING = ['장애인연금', '장애인 활동지원', '받는 급여 없음'] as const
type Receiving = (typeof RECEIVING)[number]

/** 12 소득·수급 조건 */
export function IncomePage() {
  const navigate = useNavigate()
  const [income, setIncome] = useState('')
  const [status, setStatus] = useState<(typeof BENEFIT_STATUS)[number]>('해당 없음')
  const [receiving, setReceiving] = useState<Receiving[]>(['받는 급여 없음'])
  const next = () => navigate('/services')

  // "받는 급여 없음"은 다른 항목과 함께 선택할 수 없음
  const handleReceiving = (values: Receiving[]) => {
    const added = values.find((v) => !receiving.includes(v))
    if (added === '받는 급여 없음') setReceiving(['받는 급여 없음'])
    else setReceiving(values.filter((v) => v !== '받는 급여 없음'))
  }

  return (
    <FlowLayout step={2} backTo="/questions">
      <PageTitle
        title="소득 정보를 확인할게요"
        description="입력하면 더 정확한 지원을 추천해 드릴 수 있어요. 모르는 항목은 건너뛰어도 괜찮아요."
      />

      <div className="-mt-1 flex flex-col gap-6">
        <Card className="flex flex-col gap-3.5">
          <label htmlFor="income" className="text-[17px] font-bold">
            월 소득은 얼마인가요? (선택)
          </label>
          <div className="flex h-13 items-center gap-2 rounded-lg border border-gray-300 px-4 focus-within:border-primary">
            <input
              id="income"
              inputMode="numeric"
              value={income}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '')
                setIncome(digits ? Number(digits).toLocaleString() : '')
              }}
              placeholder="예: 1,500,000"
              aria-describedby="income-hint"
              className="min-w-0 flex-1 text-[16px] placeholder:text-gray-500 focus:outline-none"
            />
            <span className="text-[16px] font-medium">원</span>
          </div>
          <p id="income-hint" className="text-[13px] text-gray-500">
            월 평균 근로소득, 사업소득, 임대소득 등을 합한 금액이에요. 정확한 소득인정액은 창구에서
            계산해요.
          </p>
        </Card>

        <Card className="flex flex-col gap-3.5">
          <h2 className="text-[17px] font-bold">수급 상태를 선택해 주세요</h2>
          <RadioTileGroup
            label="수급 상태"
            options={BENEFIT_STATUS}
            columns={3}
            value={status}
            onChange={setStatus}
          />
          <p className="text-[13px] text-gray-500">
            국민기초생활보장 수급 여부와 차상위계층 인정 여부를 확인해 주세요.
          </p>
        </Card>

        <Card className="flex flex-col gap-3.5">
          <h2 className="text-[17px] font-bold">이미 받고 있는 급여가 있나요?</h2>
          <CheckboxTileGroup
            label="받고 있는 급여"
            options={RECEIVING}
            columns={3}
            values={receiving}
            onChange={handleReceiving}
          />
          <p className="text-[13px] text-gray-500">
            일부 제도는 함께 받을 수 없어서, 받고 있는 급여가 있으면 모두 선택해 주세요.
          </p>
        </Card>

        <InfoNote>입력한 소득 정보는 이번 세션의 추천 계산에만 쓰이고 저장되지 않아요.</InfoNote>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[140px] shrink-0" onClick={next}>
            건너뛰기
          </Button>
          <Button className="flex-1" onClick={next}>
            확인
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
