import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { SituationLayout } from '../components/situation/SituationLayout'
import { CIRCUMSTANCES, DISABILITY_TYPES, SEVERITIES } from '../data/profileOptions'
import { useSituation } from '../situation/SituationContext'

/** 2/4 · 08 나이·장애 (POST /analyze 실패(E502) 때도 진입 · 고른 값은 12 판정 요청에 실림) */
export function ProfilePage() {
  const { situation, update } = useSituation()
  const { age, disabilityType, severity, circumstances } = situation

  const toggleCircumstance = (c: string) =>
    update({ circumstances: circumstances.includes(c) ? circumstances.filter((x) => x !== c) : [...circumstances, c] })

  return (
    <SituationLayout step={2} title="나이와 장애를 알려 주세요">
      <Field id="age-title" title="나이">
        <div className="flex items-center gap-2.5">
          <span className="text-17 text-text">만</span>
          <input
            aria-labelledby="age-title"
            inputMode="numeric"
            maxLength={3}
            value={age}
            onChange={(e) => update({ age: e.target.value.replace(/\D/g, '') })}
            className="h-13 w-24 rounded-xl border-[1.5px] border-primary bg-surface text-center text-22 font-bold text-text-strong outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
          />
          <span className="text-17 text-text">세</span>
        </div>
      </Field>

      <Field id="type-title" title="장애 유형">
        <div className="flex flex-wrap gap-2">
          {DISABILITY_TYPES.map((t) => (
            <ChoiceButton key={t} size="chip" selected={disabilityType === t} onClick={() => update({ disabilityType: t })}>
              {t}
            </ChoiceButton>
          ))}
        </div>
      </Field>

      <Field id="severity-title" title="장애 정도" hint="복지카드에 적혀 있어요 · 예전 1~3급은 심한 장애">
        <div className="flex gap-2">
          {SEVERITIES.map((s) => (
            <ChoiceButton key={s} selected={severity === s} onClick={() => update({ severity: s })}>
              {s}
            </ChoiceButton>
          ))}
        </div>
      </Field>

      <Field id="circumstance-title" title="해당하는 것" hint="여러 개 고를 수 있어요">
        <div className="flex flex-wrap gap-2">
          {CIRCUMSTANCES.map((c) => (
            <ChoiceButton key={c} size="chip" selected={circumstances.includes(c)} onClick={() => toggleCircumstance(c)}>
              {c}
            </ChoiceButton>
          ))}
        </div>
      </Field>
    </SituationLayout>
  )
}
