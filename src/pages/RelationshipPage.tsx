import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'
import { ChoiceChipGroup } from '../components/ChoiceChip'
import { StepLayout } from '../components/StepLayout'
import { useFlow, type Relationship, type SubjectConsent } from '../flow/FlowContext'

const RELATIONSHIP_OPTIONS: { value: Relationship; label: string }[] = [
  { value: '부모', label: '부모' },
  { value: '보호자', label: '보호자' },
  { value: '가족', label: '가족' },
  { value: '적법한 대리인', label: '적법한 대리인' },
  { value: '지원인', label: '지원인' },
]

const CONSENT_OPTIONS: { value: SubjectConsent; label: string }[] = [
  { value: 'yes', label: '네, 동의했습니다' },
  { value: 'no', label: '아니오, 미동의' },
  { value: 'unknown', label: '모름' },
]

function Section({
  title,
  description,
  divider = false,
  children,
}: {
  title: string
  description?: string
  divider?: boolean
  children: ReactNode
}) {
  return (
    <section className={`flex flex-col gap-3.5 ${divider ? 'border-t border-gray-200 pt-6' : ''}`}>
      <div className="flex flex-col gap-1">
        <h3 className="text-[18px] font-bold">{title}</h3>
        {description && <p className="text-[15px] text-gray-700">{description}</p>}
      </div>
      {children}
    </section>
  )
}

/** 05 관계·권한 입력 */
export function RelationshipPage() {
  const navigate = useNavigate()
  const { state, update } = useFlow()

  return (
    <StepLayout step={4} formWidth={560} gap="md">
      <h2 className="text-[28px] leading-[1.35] font-bold">도움 관계를 알려 주세요</h2>

      <Section title="지원 대상자와의 관계" description="누가 신청을 돕고 있나요?">
        <ChoiceChipGroup
          label="지원 대상자와의 관계"
          options={RELATIONSHIP_OPTIONS}
          value={state.relationship}
          onChange={(relationship) => update({ relationship })}
        />
      </Section>

      <Section
        title="당사자 동의 확인"
        description="지원 대상자가 이 신청을 도움받는 것에 동의했나요?"
        divider
      >
        <ChoiceChipGroup
          label="당사자 동의 확인"
          options={CONSENT_OPTIONS}
          value={state.subjectConsent}
          onChange={(subjectConsent) => update({ subjectConsent })}
        />
      </Section>

      <Section title="정보 사용 동의" divider>
        <Checkbox
          checked={state.useVoice}
          onChange={(useVoice) => update({ useVoice })}
          className="items-start"
        >
          <span className="flex flex-1 flex-col gap-0.5">
            <span className="text-[15px] font-medium">음성 입력을 사용하겠습니다</span>
            <span className="text-[14px] text-gray-500">글 대신 음성으로 말씀해 주셔도 돼요.</span>
          </span>
        </Checkbox>
      </Section>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="w-[120px] shrink-0"
          onClick={() => navigate('/applicant')}
        >
          이전
        </Button>
        <Button className="flex-1" onClick={() => navigate('/chat')}>
          다음
        </Button>
      </div>
    </StepLayout>
  )
}
