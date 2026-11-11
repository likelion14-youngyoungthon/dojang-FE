import { useNavigate } from 'react-router'
import { Button } from '../components/Button'
import { Checkbox } from '../components/Checkbox'
import { StepLayout } from '../components/StepLayout'
import { useFlow } from '../flow/FlowContext'

const SECTIONS = [
  {
    title: '수집되는 정보',
    items: ['장애 상황(유형, 정도, 변경사항)', '나이, 거주지, 소득 정보', '음성 녹음(음성 입력 사용 시)'],
  },
  {
    title: '정보 사용 목적',
    items: ['신청 가능한 지원 후보 분석', '필요 서류·절차·기한 안내', '음성 텍스트 변환(음성 입력 시)'],
  },
  {
    title: '정보 저장 방식',
    items: [
      '이 대화만 저장(세션 종료 시 삭제됨)',
      '원음·대화 기록 장기 보관 안 함',
      '계정 저장은 별도 동의 진행',
    ],
  },
  {
    title: '중요한 점',
    highlight: true,
    items: [
      'AI 서비스로 정보가 전송됩니다',
      '실제 자격은 창구에서 최종 확인합니다',
      '지원 여부는 법적 심사에 따릅니다',
    ],
  },
]

/** 03 정보 사용 안내·동의 */
export function ConsentPage() {
  const navigate = useNavigate()
  const { state, update } = useFlow()

  return (
    <StepLayout step={2} formWidth={640}>
      <div className="flex flex-col gap-2 font-bold">
        <p className="text-[14px] text-primary">정보 사용 안내</p>
        <h2 className="text-[28px] leading-[1.35]">시작하기 전에 확인해 주세요</h2>
      </div>

      <div className="grid overflow-hidden rounded-xl border border-gray-200 sm:grid-cols-2">
        {SECTIONS.map((section, i) => (
          <section
            key={section.title}
            className={`flex flex-col gap-2.5 px-6 py-[22px] ${
              section.highlight ? 'bg-primary-50' : ''
            } ${i % 2 === 1 ? 'sm:border-l sm:border-gray-200' : ''} ${
              i >= 1 ? 'max-sm:border-t max-sm:border-gray-200' : ''
            } ${i >= 2 ? 'sm:border-t sm:border-gray-200' : ''}`}
          >
            <h3
              className={`text-[15px] font-bold ${section.highlight ? 'text-primary' : 'text-gray-900'}`}
            >
              {section.title}
            </h3>
            <ul className="text-[14px] leading-[1.75] text-gray-700">
              {section.items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Checkbox
        checked={state.agreedToTerms}
        onChange={(agreedToTerms) => update({ agreedToTerms })}
        className="items-center rounded-lg bg-gray-50 px-4 py-3.5"
      >
        <span className="flex-1 text-[15px] font-medium">
          위 내용을 이해했으며, 정보 수집·사용·AI 전송에 동의합니다
        </span>
      </Checkbox>

      <div className="flex gap-3">
        <Button variant="secondary" className="w-[120px] shrink-0" onClick={() => navigate('/region')}>
          이전
        </Button>
        <Button
          className="flex-1"
          disabled={!state.agreedToTerms}
          onClick={() => navigate('/applicant')}
        >
          동의하고 계속
        </Button>
      </div>
    </StepLayout>
  )
}
