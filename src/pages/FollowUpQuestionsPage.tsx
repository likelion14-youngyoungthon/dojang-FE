import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Card, InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { RadioTileGroup } from '../components/OptionTile'

const ANSWERS = ['예', '아니오', '모름'] as const
type Answer = (typeof ANSWERS)[number]

// TODO: AI 분석에서 부족한 조건을 기반으로 생성된 질문으로 교체
const QUESTIONS = [
  {
    id: 'ltc',
    question: '현재 노인장기요양보험 급여를 받고 계신가요?',
    why: '왜 묻나요? 활동지원과 함께 받기 어려운 경우가 있어서 확인이 필요해요.',
  },
  {
    id: 'mobility',
    question: '혼자 이동할 때 다른 사람의 도움이 필요한가요?',
    why: '왜 묻나요? 특별교통수단 이용 대상인지 확인하는 데 필요해요.',
  },
]

/** 11 되묻기 질문 */
export function FollowUpQuestionsPage() {
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, Answer | null>>({ ltc: '아니오' })
  const next = () => navigate('/income')

  return (
    <FlowLayout step={2} backTo="/prior-applications">
      <PageTitle
        title={`확인할 사항이 ${QUESTIONS.length}가지 있어요`}
        description="다음 정보를 확인하면 신청 가능한 서비스를 더 정확하게 안내해 드릴 수 있어요."
      />

      <div className="-mt-1 flex flex-col gap-6">
        {QUESTIONS.map((q, i) => (
          <Card key={q.id} className="flex flex-col gap-3">
            <p className="text-[13px] font-bold text-primary">
              질문 {i + 1} / {QUESTIONS.length}
            </p>
            <h2 className="text-[20px] leading-[1.4] font-bold">{q.question}</h2>
            <InfoNote>{q.why}</InfoNote>
            <div className="pt-1">
              <RadioTileGroup
                label={q.question}
                options={ANSWERS}
                columns={3}
                value={answers[q.id] ?? null}
                onChange={(answer) => setAnswers((prev) => ({ ...prev, [q.id]: answer }))}
              />
            </div>
          </Card>
        ))}

        <InfoNote>
          '모름'을 선택하면 해당 조건은 '확인 필요'로 남고, 창구에서 확인하도록 안내해 드려요.
        </InfoNote>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[180px] shrink-0" onClick={next}>
            이 단계 건너뛰기
          </Button>
          <Button className="flex-1" onClick={next}>
            확인하고 계속
          </Button>
        </div>
      </div>
    </FlowLayout>
  )
}
