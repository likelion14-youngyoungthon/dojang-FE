import { useNavigate } from 'react-router'
import infoIcon from '../assets/icons/info.svg'
import radioOffIcon from '../assets/icons/radio-off.svg'
import radioOnIcon from '../assets/icons/radio-on.svg'
import { Button } from '../components/Button'
import { StepLayout } from '../components/StepLayout'
import { useFlow, type Applicant } from '../flow/FlowContext'

const OPTIONS: { value: Applicant; title: string; description: string }[] = [
  { value: 'self', title: '본인 신청을 알아봐요', description: '본인의 신청 정보를 직접 관리해요.' },
  {
    value: 'other',
    title: '다른 사람 신청을 도와요',
    description: '가족, 보호자, 지원인이 신청을 함께 준비해요.',
  },
]

/** 04 이용 주체 선택 */
export function ApplicantPage() {
  const navigate = useNavigate()
  const { state, update } = useFlow()

  return (
    <StepLayout step={3} formWidth={520}>
      <div className="flex flex-col gap-2">
        <h2 className="text-[28px] leading-[1.35] font-bold">누가 신청 정보를 입력할까요?</h2>
        <p className="text-[16px] leading-[1.6] text-gray-700">
          본인이 직접 입력하거나, 가족·보호자·지원인이 도와줄 수 있어요.
        </p>
      </div>

      <div role="radiogroup" aria-label="이용 주체" className="flex flex-col gap-3">
        {OPTIONS.map((option) => {
          const selected = state.applicant === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => update({ applicant: option.value })}
              className={`flex items-center gap-4 rounded-[10px] px-6 py-[22px] text-left transition-colors ${
                selected
                  ? 'border-2 border-primary bg-primary-50'
                  : 'border border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <img src={selected ? radioOnIcon : radioOffIcon} alt="" width={22} height={22} />
              <span className="flex flex-1 flex-col gap-1">
                <span className="text-[17px] font-bold">{option.title}</span>
                <span className="text-[14px] text-gray-700">{option.description}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-4 py-3.5">
        <img src={infoIcon} alt="" width={18} height={18} className="mt-0.5" />
        <p className="flex-1 text-[14px] leading-[1.6] text-gray-700">
          실제 신청서 제출과 자격 심사는 관할 창구와 기관에서 진행돼요.
          <br />
          이 서비스는 정보 준비와 상태 관리만 도와요.
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="w-[120px] shrink-0" onClick={() => navigate('/consent')}>
          이전
        </Button>
        <Button
          className="flex-1"
          onClick={() => navigate(state.applicant === 'other' ? '/relationship' : '/chat')}
        >
          다음
        </Button>
      </div>
    </StepLayout>
  )
}
