import { useState } from 'react'
import { useNavigate } from 'react-router'
import micSmIcon from '../assets/icons/mic-sm.svg'
import micIcon from '../assets/icons/mic.svg'
import { Button } from '../components/Button'
import { FlowLayout, PageTitle } from '../components/FlowLayout'
import { useFlow } from '../flow/FlowContext'

// TODO: 실제 음성 인식(STT) 결과로 교체
const MOCK_TRANSCRIPT =
  '최근에 장애 등록을 했어요. 혼자 출퇴근하는데 이동이 너무 불편해요. 어떤 지원을 받을 수 있는지 알고 싶어요.'
const MOCK_DURATION = '0:24'

/** 07 음성 변환 확인 */
export function VoiceConfirmPage() {
  const navigate = useNavigate()
  const { update } = useFlow()
  const [text, setText] = useState(MOCK_TRANSCRIPT)

  return (
    <FlowLayout step={1} backTo="/chat">
      <PageTitle
        title="변환된 내용을 확인해 주세요"
        description="음성이 아래와 같이 입력되었어요. 확인하고 필요하면 직접 고쳐 주세요."
      />

      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="transcript" className="text-[15px] font-bold">
            변환된 음성 내용
          </label>
          <p className="flex items-center gap-1.5 text-[13px] text-gray-500">
            <img src={micSmIcon} alt="" width={16} height={16} />
            녹음 길이 {MOCK_DURATION}
          </p>
        </div>
        <textarea
          id="transcript"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-describedby="transcript-hint"
          className="h-[200px] w-full resize-none rounded-xl border-[1.5px] border-primary px-6 py-5 text-[17px] leading-[1.7] focus:outline-none"
        />
        <p id="transcript-hint" className="text-[14px] text-gray-500">
          잘못 알아들은 부분이 있으면 글자를 눌러 바로 고칠 수 있어요.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          variant="secondary"
          className="w-[160px] shrink-0 gap-2"
          onClick={() => setText(MOCK_TRANSCRIPT)}
        >
          <img src={micIcon} alt="" width={20} height={20} />
          다시 녹음
        </Button>
        <Button
          className="flex-1"
          disabled={!text.trim()}
          onClick={() => {
            update({ situation: text })
            navigate('/confirm')
          }}
        >
          확인
        </Button>
      </div>
    </FlowLayout>
  )
}
