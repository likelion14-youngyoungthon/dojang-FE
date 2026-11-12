import minusIcon from '../assets/icons/minus.svg'
import plusIcon from '../assets/icons/plus.svg'
import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { RadioCard } from '../components/situation/RadioCard'
import { SituationLayout } from '../components/situation/SituationLayout'
import { BASIC_LIVELIHOOD, getIncomeBrackets } from '../data/profileOptions'
import { useNavigate } from 'react-router'
import { useSituation } from '../situation/SituationContext'

const MIN_HOUSEHOLD = 1
const MAX_HOUSEHOLD = 6

/** 4/4 가구·소득 — 마지막 단계 */
export function HouseholdPage() {
  const { situation, update } = useSituation()
  const { householdSize, basicLivelihood, income } = situation
  const brackets = getIncomeBrackets(householdSize)

  const navigate = useNavigate()
  // TODO: POST /judge 연동 · 그 사이 L1 정리 중 화면(디자인 전) 보여 주기
  const handleResult = () => navigate('/results')

  const stepButton =
    'flex size-13 items-center justify-center rounded-xl border border-border bg-surface hover:bg-bg-sidebar disabled:opacity-40'

  return (
    <SituationLayout step={4} title="가구와 소득을 알려 주세요" onNext={handleResult}>
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
        <div role="radiogroup" aria-labelledby="income-title" className="grid items-start gap-3 sm:grid-cols-2">
          {brackets.map((b) => (
            <RadioCard
              key={b.value}
              label={b.label}
              sub={'sub' in b ? b.sub : undefined}
              selected={income === b.value}
              onSelect={() => update({ income: b.value })}
            />
          ))}
        </div>
      </Field>
    </SituationLayout>
  )
}
