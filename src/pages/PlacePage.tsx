import pinIcon from '../assets/icons/pin.svg'
import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { RadioCard } from '../components/situation/RadioCard'
import { SituationLayout } from '../components/situation/SituationLayout'
import { DONGS_BY_GU, GU_LIST, getOffice } from '../data/regions'
import { useSituation, type Applicant } from '../situation/SituationContext'

const APPLICANTS: Applicant[] = ['본인', '가족·보호자']

/** 1/4 · 01 사는 곳·누가 (API: GET /dongs · GET /offices) */
export function PlacePage() {
  const { situation, update } = useSituation()
  const { gu, dong, applicant } = situation
  const office = gu && dong ? getOffice(gu, dong) : null

  return (
    <SituationLayout step={1} title="사는 곳과 쓰는 분을 알려 주세요">
      <Field id="place-title" title="사는 곳">
        <div className="flex gap-2">
          {GU_LIST.map((g) => (
            <ChoiceButton key={g} selected={gu === g} onClick={() => update({ gu: g, dong: null })}>
              {g}
            </ChoiceButton>
          ))}
        </div>

        {gu && (
          <div className="flex flex-wrap gap-2" aria-label={`${gu} 읍면동`}>
            {DONGS_BY_GU[gu].map((d) => (
              <ChoiceButton key={d} size="chip" selected={dong === d} onClick={() => update({ dong: d })}>
                {d}
              </ChoiceButton>
            ))}
          </div>
        )}

        {office && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-bg-page px-4 py-3">
            <img src={pinIcon} alt="" width={18} height={18} />
            <p className="text-14 text-text-sub">신청하는 곳</p>
            <p className="text-17 font-bold text-text-strong">{office.name}</p>
            <span className="flex-1" />
            <p className="text-14 text-text-sub">{office.address}</p>
          </div>
        )}
      </Field>

      <hr className="w-full border-divider" />

      <Field id="applicant-title" title="누가 쓰시나요?">
        <div role="radiogroup" aria-labelledby="applicant-title" className="flex flex-col gap-3 sm:flex-row">
          {APPLICANTS.map((a) => (
            <RadioCard key={a} label={a} selected={applicant === a} onSelect={() => update({ applicant: a })} />
          ))}
        </div>
      </Field>
    </SituationLayout>
  )
}
