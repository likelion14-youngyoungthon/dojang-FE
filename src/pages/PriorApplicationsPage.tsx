import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { FlowLayout } from '../components/FlowLayout'
import { CheckboxTileGroup, RadioTileGroup } from '../components/OptionTile'

const HAS_APPLIED = ['이전에 신청한 지원이 있어요', '신청한 지원이 없어요', '잘 모르겠어요'] as const

const SERVICES = [
  '장애인연금',
  '장애수당 또는 장애아동수당',
  '장애인 활동지원',
  '보조기기 지원',
  '발달재활서비스',
  '특별교통수단 이용등록',
  '기타 (직접 입력)',
] as const

const STATUSES = [
  '신청서를 제출했어요 (결과 기다리는 중)',
  '알아만 봤어요 (아직 신청 안 함)',
  '승인 안내를 받았어요',
  '이미 이용 중이에요',
  '잘 모르겠어요',
] as const

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-[20px] leading-[1.35] font-bold">{title}</h2>
      <p className="text-[15px] leading-[1.6] text-gray-700">{description}</p>
    </div>
  )
}

/** 10 기신청 확인 */
export function PriorApplicationsPage() {
  const navigate = useNavigate()
  const [hasApplied, setHasApplied] = useState<(typeof HAS_APPLIED)[number]>(HAS_APPLIED[0])
  const [services, setServices] = useState<(typeof SERVICES)[number][]>(['장애수당 또는 장애아동수당'])
  const [otherName, setOtherName] = useState('')
  const [status, setStatus] = useState<(typeof STATUSES)[number] | null>(STATUSES[0])
  const showDetails = hasApplied === HAS_APPLIED[0]
  const next = () => navigate('/questions')

  return (
    <FlowLayout step={2} backTo="/confirm">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[32px] leading-[1.35] font-bold">이전에 신청한 지원이 있나요?</h1>
          <p className="text-[17px] leading-[1.6] text-gray-700">
            신청한 적 있는 지원을 알려 주시면 중복 안내를 줄일 수 있어요.
          </p>
        </div>
        <RadioTileGroup
          label="이전 신청 여부"
          options={HAS_APPLIED}
          columns={3}
          value={hasApplied}
          onChange={setHasApplied}
        />
      </section>

      {showDetails && (
        <>
          <section className="flex flex-col gap-4 border-t border-gray-200 pt-7">
            <SectionHeading
              title="어떤 지원을 신청하셨나요?"
              description="해당하는 항목을 모두 선택해 주세요. 정확하지 않아도 괜찮아요."
            />
            <CheckboxTileGroup
              label="신청한 지원"
              options={SERVICES}
              values={services}
              onChange={setServices}
            />
            <label htmlFor="other-service" className="sr-only">
              기타 지원 이름
            </label>
            <input
              id="other-service"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              disabled={!services.includes('기타 (직접 입력)')}
              placeholder="기타 지원 이름을 입력해 주세요"
              className="-mt-1.5 h-[50px] rounded-lg border border-gray-300 px-4 text-[15px] placeholder:text-gray-500 focus:border-primary focus:outline-none disabled:bg-white"
            />
          </section>

          <section className="flex flex-col gap-4 border-t border-gray-200 pt-7">
            <SectionHeading
              title="현재 상태가 어떻게 되나요?"
              description="신청한 지원의 현재 상태를 선택해 주세요."
            />
            <RadioTileGroup label="신청 상태" options={STATUSES} value={status} onChange={setStatus} />
            <p className="text-[13px] text-gray-500">선택한 상태는 나중에 대화로 바꿀 수 있어요.</p>
          </section>
        </>
      )}

      <div className="flex gap-3">
        <Button variant="secondary" className="w-[140px] shrink-0" onClick={next}>
          건너뛰기
        </Button>
        <Button className="flex-1" onClick={next}>
          계속하기
        </Button>
      </div>
    </FlowLayout>
  )
}
