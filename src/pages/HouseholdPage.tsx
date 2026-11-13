import minusIcon from '../assets/icons/minus.svg'
import plusIcon from '../assets/icons/plus.svg'
import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { RadioCard } from '../components/situation/RadioCard'
import { SituationLayout } from '../components/situation/SituationLayout'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { bandText, useIncomeBands } from '../api/incomeBands'
import { BASIC_LIVELIHOOD } from '../data/profileOptions'
import { useResults } from '../results/ResultsContext'
import { useSituation } from '../situation/SituationContext'

const MIN_HOUSEHOLD = 1
const MAX_HOUSEHOLD = 6

/** 4/4 가구·소득 — 마지막 단계 (API: GET /income-bands · '결과 보기'에서 POST /judge 1번) */
export function HouseholdPage() {
  const { situation, update } = useSituation()
  const { householdSize, basicLivelihood, income, incomeLabel } = situation
  const { bands, loading, error, retry } = useIncomeBands(householdSize)

  // 가족 수가 바뀌면 같은 구간의 새 금액으로 화면 글자를 맞춤
  const selected = bands?.find((b) => b.id === income)
  const selectedLabel = selected && bands ? bandText(selected, bands).label : null
  useEffect(() => {
    if (selectedLabel && selectedLabel !== incomeLabel) update({ incomeLabel: selectedLabel })
  }, [selectedLabel, incomeLabel, update])

  const navigate = useNavigate()
  const { runJudge } = useResults()
  const [judging, setJudging] = useState(false)
  const [judgeError, setJudgeError] = useState<string | null>(null)
  // TODO: L1 정리 중 화면(디자인 전) — 지금은 버튼 글자만 '정리하는 중'
  const handleResult = async () => {
    setJudging(true)
    setJudgeError(null)
    try {
      await runJudge(situation)
      navigate('/results')
    } catch (e) {
      setJudgeError((e as Error).message)
      setJudging(false)
    }
  }

  const stepButton =
    'flex size-13 items-center justify-center rounded-xl border border-border bg-surface hover:bg-bg-sidebar disabled:opacity-40'

  return (
    <SituationLayout step={4} title="가구와 소득을 알려 주세요" onNext={handleResult} nextBusy={judging}>
      {judgeError && (
        <p role="alert" className="rounded-xl bg-bg-page px-4 py-3 text-15 text-text">
          결과를 정리하지 못했어요. {judgeError}
        </p>
      )}
      <Field id="household-title" title="함께 사는 가족 수">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="한 명 줄이기"
            disabled={householdSize <= MIN_HOUSEHOLD}
            onClick={() => update({ householdSize: householdSize - 1 })}
            className={stepButton}
          >
            <img src={minusIcon} alt="" width={20} height={20} />
          </button>
          <output
            aria-labelledby="household-title"
            aria-live="polite"
            className="flex h-13 w-[120px] items-center justify-center rounded-xl border-[1.5px] border-primary bg-surface text-22 font-bold text-text-strong"
          >
            {householdSize}명{householdSize === MAX_HOUSEHOLD && ' 이상'}
          </output>
          <button
            type="button"
            aria-label="한 명 늘리기"
            disabled={householdSize >= MAX_HOUSEHOLD}
            onClick={() => update({ householdSize: householdSize + 1 })}
            className={stepButton}
          >
            <img src={plusIcon} alt="" width={20} height={20} />
          </button>
        </div>
      </Field>

      <Field id="livelihood-title" title="기초생활수급·차상위">
        <div className="grid grid-cols-2 gap-2">
          {BASIC_LIVELIHOOD.map((b) => (
            <ChoiceButton key={b} selected={basicLivelihood === b} onClick={() => update({ basicLivelihood: b })}>
              {b}
            </ChoiceButton>
          ))}
        </div>
      </Field>

      <Field id="income-title" title="가족 전체 한 달 소득" hint={`${householdSize}명 가구 기준`}>
        {loading && <p className="text-15 text-text-sub">소득 기준을 불러오는 중이에요</p>}
        {error && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-15 text-text-sub">소득 기준을 불러오지 못했어요. {error}</p>
            <button type="button" onClick={retry} className="text-15 font-medium text-primary underline">
              다시 시도
            </button>
          </div>
        )}
        <div role="radiogroup" aria-labelledby="income-title" className="grid items-start gap-3 sm:grid-cols-2">
          {bands?.map((b) => {
            const text = bandText(b, bands)
            return (
              <RadioCard
                key={b.id}
                label={text.label}
                sub={text.sub}
                selected={income === b.id}
                onSelect={() => update({ income: b.id, incomeLabel: text.label })}
              />
            )
          })}
        </div>
      </Field>
    </SituationLayout>
  )
}
