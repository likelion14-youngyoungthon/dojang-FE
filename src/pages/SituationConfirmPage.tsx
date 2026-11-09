import { useNavigate } from 'react-router'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { useFlow } from '../flow/FlowContext'

// TODO: AI 분석 API 결과로 교체
const MOCK_ANALYSIS = {
  subject: '이○○',
  facts: ['용인시 거주', '지체장애 등록', '만 38세', '장애 정도: 심한 장애'],
  wishes: ['활동지원 이용 희망', '이동 지원 관련 정보 원함'],
  changes: [{ label: '거주지', value: '수지구 → 기흥구' }],
  unknowns: [
    { label: '소득인정액', description: '확인되지 않은 값은 다음 단계에서 따로 물어볼게요.' },
    { label: '현재 수급 여부', description: '받고 있는 급여가 있으면 후보에 영향을 줄 수 있어요.' },
  ],
}

function CardTitle({ children }: { children: string }) {
  return <h2 className="text-[16px] font-bold">{children}</h2>
}

function CardHint({ children }: { children: string }) {
  return <p className="text-[13px] text-gray-500">{children}</p>
}

/** 09 상황 확인 카드 */
export function SituationConfirmPage() {
  const navigate = useNavigate()
  const { state } = useFlow()
  const self = state.applicant === 'self'
  const a = MOCK_ANALYSIS

  return (
    <FlowLayout step={2} backTo="/chat" contentWidth={840}>
      <PageTitle
        title="AI가 이해한 상황을 확인해 주세요"
        description="항목을 누르면 원문 근거를 확인하고 수정할 수 있어요."
      />

      <div className="-mt-1 flex flex-col gap-4">
        <Card className="flex flex-wrap items-center gap-x-12 gap-y-3">
          <h2 className="flex-1 text-[16px] font-bold">누구의 상황인가요?</h2>
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] text-gray-500">지원 대상자</p>
            <p className="text-[16px] font-bold">
              {a.subject} ({self ? '본인' : state.relationship})
            </p>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] text-gray-500">입력자</p>
            <p className="text-[16px] font-bold">{self ? '본인 직접 입력' : `${state.relationship} 대리 입력`}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/applicant')}
            className="text-[14px] font-medium text-primary underline"
          >
            수정
          </button>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="flex flex-col gap-3.5">
            <CardTitle>확정된 사실</CardTitle>
            <ul className="flex flex-wrap gap-2">
              {a.facts.map((fact) => (
                <li key={fact}>
                  <button
                    type="button"
                    onClick={() => navigate('/chat')}
                    className="rounded-md bg-primary-50 px-3 py-1.5 text-[15px] font-medium text-primary hover:bg-primary/10"
                  >
                    {fact}
                  </button>
                </li>
              ))}
            </ul>
            <CardHint>항목을 눌러 원문 근거를 확인하고 수정할 수 있어요.</CardHint>
          </Card>

          <Card className="flex flex-col gap-3.5">
            <CardTitle>희망 사항</CardTitle>
            <ul className="flex flex-wrap gap-2">
              {a.wishes.map((wish) => (
                <li
                  key={wish}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-[15px] font-medium"
                >
                  {wish}
                </li>
              ))}
            </ul>
            <CardHint>희망 사항은 신청 추천에 참고하며 자격을 확정하지 않아요.</CardHint>
          </Card>

          <Card className="flex flex-col gap-3.5">
            <CardTitle>변경된 정보</CardTitle>
            {a.changes.map((change) => (
              <div
                key={change.label}
                className="flex w-fit items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-[15px]"
              >
                <span className="font-medium text-gray-700">{change.label}</span>
                <span className="font-bold">{change.value}</span>
                <Badge className="px-1.5 py-0.5">변경</Badge>
              </div>
            ))}
            <CardHint>이사 등 최근 변경 사항을 확인해 주세요.</CardHint>
          </Card>

          <Card className="flex flex-col">
            <CardTitle>추가 확인이 필요한 항목</CardTitle>
            {a.unknowns.map((item, i) => (
              <div
                key={item.label}
                className={`flex flex-col gap-1 py-3 ${i < a.unknowns.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium">{item.label}</p>
                  <Badge tone="orange">확인 필요</Badge>
                </div>
                <CardHint>{item.description}</CardHint>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <InfoNote>확인되지 않은 항목은 신청 추천 결과에 반영되지 않아요.</InfoNote>
          <Button className="px-6" onClick={() => navigate('/prior-applications')}>
            확인 완료 · 기신청 여부 확인하기
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
