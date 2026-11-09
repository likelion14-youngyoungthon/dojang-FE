import { useState } from 'react'
import { useNavigate } from 'react-router'
import warningSmIcon from '../assets/icons/warning-sm.svg'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { FlowLayout } from '../components/FlowLayout'
import { Select } from '../components/Select'
import {
  ALL_DONGS,
  BENEFIT_STATUSES,
  BIRTH_DECADES,
  DISABILITY_LEVELS,
  DISABILITY_TYPES,
} from '../data/options'
import { useFlow } from '../flow/FlowContext'

/** 08 AI 실패 기본 안내 — 기본 정보를 직접 선택 */
export function ManualInputPage() {
  const navigate = useNavigate()
  const { state } = useFlow()
  const [form, setForm] = useState({
    name: '',
    birth: '1960년대',
    type: DISABILITY_TYPES[0],
    level: DISABILITY_LEVELS[0],
    dong: `${state.gu} ${state.dong}`,
    benefit: BENEFIT_STATUSES[0],
  })
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }))

  return (
    <FlowLayout step={1} backTo="/chat">
      <div
        role="alert"
        className="flex items-start gap-3.5 rounded-[10px] border border-warning-200 bg-warning-50 py-[18px] pr-6 pl-5"
      >
        <img src={warningSmIcon} alt="" width={24} height={24} />
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-[17px] font-bold">상황 분석은 빠졌어요</p>
          <p className="text-[15px] leading-[1.6] text-gray-700">
            AI 서비스에 일시적인 문제가 생겼어요. 아래 기본 정보를 직접 선택하면 신청 후보를 확인할 수
            있어요.
          </p>
        </div>
      </div>

      <h1 className="text-[32px] leading-[1.35] font-bold">기본 정보를 직접 선택해 주세요</h1>

      <form
        className="flex flex-col gap-7"
        onSubmit={(e) => {
          e.preventDefault()
          navigate('/confirm')
        }}
      >
        <section className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold">본인 또는 지원 대상자 정보</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="이름" htmlFor="name">
              <input
                id="name"
                value={form.name}
                onChange={set('name')}
                placeholder="이름 (선택 입력)"
                className="h-13 rounded-lg border border-gray-300 px-4 text-[16px] placeholder:text-gray-500 focus:border-primary focus:outline-none"
              />
            </Field>
            <Field label="생년월일" htmlFor="birth">
              <Select id="birth" options={BIRTH_DECADES} value={form.birth} onChange={set('birth')} />
            </Field>
            <Field label="장애 유형" htmlFor="type">
              <Select id="type" options={DISABILITY_TYPES} value={form.type} onChange={set('type')} />
            </Field>
            <Field label="장애 정도" htmlFor="level">
              <Select id="level" options={DISABILITY_LEVELS} value={form.level} onChange={set('level')} />
            </Field>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-[18px] font-bold">살고 있는 곳 · 현재 상황</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="읍면동" htmlFor="dong">
              <Select id="dong" options={ALL_DONGS} value={form.dong} onChange={set('dong')} />
            </Field>
            <Field label="현재 수급 상태" htmlFor="benefit">
              <Select
                id="benefit"
                options={BENEFIT_STATUSES}
                value={form.benefit}
                onChange={set('benefit')}
              />
            </Field>
          </div>
        </section>

        <div className="flex gap-3">
          <Button variant="secondary" className="w-[120px] shrink-0" onClick={() => navigate('/chat')}>
            취소
          </Button>
          <Button type="submit" className="flex-1">
            확인
          </Button>
        </div>
      </form>

      <p className="flex flex-wrap items-center gap-2 text-[14px]">
        <span className="text-gray-500">다시 시도하려면 음성이나 글로 상황을 설명해 주세요.</span>
        <button
          type="button"
          onClick={() => navigate('/chat')}
          className="font-medium text-primary underline"
        >
          대화 입력으로 돌아가기
        </button>
      </p>
    </FlowLayout>
  )
}
