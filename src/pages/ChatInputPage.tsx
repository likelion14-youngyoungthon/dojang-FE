import { useNavigate } from 'react-router'
import micIcon from '../assets/icons/mic.svg'
import { Button } from '../components/Button'
import { InfoNote } from '../components/Card'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { useFlow } from '../flow/FlowContext'

const MAX_LENGTH = 1000

const EXAMPLES = [
  '최근 장애 등록을 했는데 무엇을 신청해야 할지 모르겠어요',
  '혼자 출퇴근하는데 이동이 불편해요',
  '다른 구로 이사했어요',
]

/** 06 대화 입력 */
export function ChatInputPage() {
  const navigate = useNavigate()
  const { state, update } = useFlow()
  const text = state.situation

  return (
    <FlowLayout step={1} backTo={state.applicant === 'other' ? '/relationship' : '/applicant'}>
      <PageTitle
        title="상황을 말씀해 주세요"
        description="제도 이름을 몰라도 괜찮아요. 지금 어떤 어려움이 있는지, 무엇을 도움받고 싶은지 편하게 써 주세요."
      />

      <form
        className="overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-primary"
        onSubmit={(e) => {
          e.preventDefault()
          if (text.trim()) navigate('/confirm')
        }}
      >
        <label htmlFor="situation" className="sr-only">
          상황 설명
        </label>
        <textarea
          id="situation"
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(e) => update({ situation: e.target.value })}
          placeholder="예시: 최근 장애 등록을 마쳤는데 어떤 지원을 신청할 수 있는지 모르겠어요."
          className="block h-[200px] w-full resize-none px-6 py-5 text-[17px] leading-[1.6] placeholder:text-gray-500 focus:outline-none"
        />
        <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/chat/voice')}
            className="flex h-11 items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 text-[15px] font-medium hover:bg-gray-50"
          >
            <img src={micIcon} alt="" width={20} height={20} />
            음성으로 말하기
          </button>
          <div className="flex items-center gap-3.5">
            <p className="text-[13px] text-gray-500" aria-live="polite">
              {text.length.toLocaleString()} / {MAX_LENGTH.toLocaleString()}자
            </p>
            <button
              type="submit"
              disabled={!text.trim()}
              className="h-11 w-[100px] rounded-lg bg-primary text-[15px] font-bold text-white hover:bg-primary/90 disabled:opacity-40"
            >
              보내기
            </button>
          </div>
        </div>
      </form>

      <InfoNote>입력한 내용은 AI 분석에만 사용되며, 세션이 끝나면 사라져요.</InfoNote>

      <div className="flex flex-col gap-3">
        <p className="text-[15px] font-bold">이렇게 시작해 보세요</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => update({ situation: example })}
              className="h-[42px] rounded-lg border border-gray-300 bg-white px-4 text-[15px] font-medium hover:bg-gray-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-[10px] bg-gray-50 py-[18px] pr-5 pl-6">
        <div className="flex flex-col gap-0.5">
          <p className="text-[15px] font-bold">AI 분석이 잘 안 되나요?</p>
          <p className="text-[14px] text-gray-700">직접 선택하는 방식으로 바꿔서 진행할 수 있어요.</p>
        </div>
        <Button
          variant="secondary"
          className="h-11 shrink-0 px-6 text-[15px]"
          onClick={() => navigate('/chat/manual')}
        >
          직접 입력으로 전환
        </Button>
      </div>
    </FlowLayout>
  )
}
