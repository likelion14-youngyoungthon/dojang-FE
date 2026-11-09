import { useState } from 'react'
import { useNavigate } from 'react-router'
import backIcon from '../assets/icons/back.svg'
import { Button } from '../components/Button'
import { IntroPanel } from '../components/IntroPanel'
import { ToggleRow } from '../components/Toggle'
import { useFlow, type A11ySettings, type FontScale } from '../flow/FlowContext'

const FONT_SCALES: { value: FontScale; size: string }[] = [
  { value: '기본', size: 'text-[16px]' },
  { value: '크게', size: 'text-[19px]' },
  { value: '매우 크게', size: 'text-[22px]' },
]

type ToggleKey = Exclude<keyof A11ySettings, 'fontScale'>

const GROUPS: { title: string; items: { key: ToggleKey; label: string; description: string }[] }[] = [
  {
    title: '시각 지원',
    items: [
      { key: 'highContrast', label: '고대비 모드', description: '배경과 글자 색 차이를 크게 해요' },
      { key: 'screenReader', label: '화면낭독기 최적화', description: '화면낭독 앱(스크린 리더)과 함께 쓸 때 켜 주세요' },
      { key: 'focusHighlight', label: '키보드 탐색 강조', description: '탭 키로 이동할 때 현재 위치를 굵은 테두리로 보여 줘요' },
    ],
  },
  {
    title: '인지·언어 지원',
    items: [
      { key: 'easyMode', label: '쉬운 설명 모드', description: '어려운 용어 뒤에 괄호로 쉬운 풀이를 붙여요' },
      { key: 'captions', label: '자막 표시', description: '음성 안내가 나올 때 자막을 함께 보여 줘요' },
    ],
  },
  {
    title: '입력·음성',
    items: [
      { key: 'voiceInput', label: '음성 입력 사용', description: '마이크로 말해서 내용을 입력할 수 있어요' },
      { key: 'textOnly', label: '글 입력만 사용', description: '음성 기능을 끄고 글자로만 입력해요' },
    ],
  },
]

/** 25 접근성 옵션 */
export function AccessibilityPage() {
  const navigate = useNavigate()
  const { state, update } = useFlow()
  // 저장 전까지는 화면 안에서만 바꿈 (글자 크기는 미리보기로 바로 반영)
  const [draft, setDraft] = useState<A11ySettings>(state.a11y)

  const setToggle = (key: ToggleKey, value: boolean) =>
    setDraft((prev) => {
      const next = { ...prev, [key]: value }
      // 음성 입력과 글 입력만 사용은 동시에 켤 수 없음
      if (key === 'voiceInput' && value) next.textOnly = false
      if (key === 'textOnly' && value) next.voiceInput = false
      return next
    })

  const goBack = () => navigate(-1)

  return (
    <div className="flex min-h-screen bg-white">
      <IntroPanel />

      <main className="flex min-w-0 flex-1 flex-col items-center gap-8 px-6 pt-10 pb-12 md:px-24">
        <div className="w-full">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-[14px] font-medium text-gray-700 hover:text-gray-900"
          >
            <img src={backIcon} alt="" width={18} height={18} />
            처음 화면으로
          </button>
        </div>

        <div className="flex w-full max-w-[560px] flex-col gap-7">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] leading-[1.35] font-bold">접근성 설정</h1>
            <p className="text-[16px] leading-[1.6] text-gray-700">
              필요한 항목을 켜거나 끄세요. 언제든지 다시 바꿀 수 있어요.
            </p>
          </div>

          <section className="flex flex-col gap-2.5">
            <h2 className="text-[16px] font-bold">글자 크기</h2>
            <div role="radiogroup" aria-label="글자 크기" className="flex h-15 gap-1 rounded-lg bg-gray-50 p-1">
              {FONT_SCALES.map(({ value, size }) => {
                const selected = draft.fontScale === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDraft((prev) => ({ ...prev, fontScale: value }))}
                    className={`flex-1 rounded-md leading-[1.3] ${size} ${
                      selected
                        ? 'border-[1.5px] border-primary bg-white font-bold text-primary'
                        : 'font-medium text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </section>

          {GROUPS.map((group) => (
            <section key={group.title} className="flex flex-col gap-1">
              <h2 className="text-[16px] font-bold">{group.title}</h2>
              <div className="overflow-hidden rounded-[10px] border border-gray-200">
                {group.items.map((item) => (
                  <ToggleRow
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    checked={draft[item.key]}
                    onChange={(value) => setToggle(item.key, value)}
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="flex gap-3">
            <Button variant="secondary" className="w-[180px] shrink-0" onClick={goBack}>
              설정 없이 시작하기
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                update({ a11y: draft, useVoice: draft.voiceInput })
                goBack()
              }}
            >
              설정 저장하고 시작하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
