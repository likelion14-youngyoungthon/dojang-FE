import pinIcon from '../assets/icons/pin.svg'
import { ChoiceButton } from '../components/situation/ChoiceButton'
import { Field } from '../components/situation/Field'
import { RadioCard } from '../components/situation/RadioCard'
import { SituationLayout } from '../components/situation/SituationLayout'
import { useDongs } from '../api/dongs'
import { useOffices } from '../api/offices'
import { useSituation, type Applicant } from '../situation/SituationContext'

const APPLICANTS: Applicant[] = ['본인', '가족·보호자']

/** 1/4 · 01 사는 곳·누가 (API: GET /dongs · GET /offices) */
export function PlacePage() {
  const { situation, update } = useSituation()
  const { gu, dong, applicant } = situation
  const { byGu, loading, error, retry } = useDongs()
  const offices = useOffices(dong)
  // 신청하는 곳 = 그 동의 행정복지센터
  const office = offices.offices?.find((o) => o.id === 'dong_center') ?? null

  return (
    <SituationLayout step={1} title="사는 곳과 쓰는 분을 알려 주세요">
      <Field id="place-title" title="사는 곳">
        {loading && <p className="text-15 text-text-sub">읍면동 목록을 불러오는 중이에요</p>}
        {error && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-15 text-text-sub">읍면동 목록을 불러오지 못했어요. {error}</p>
            <button type="button" onClick={retry} className="text-15 font-medium text-primary underline">
              다시 시도
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {[...byGu.keys()].map((g) => (
            <ChoiceButton key={g} selected={gu === g} onClick={() => update({ gu: g, dong: null })}>
              {g}
            </ChoiceButton>
          ))}
        </div>

        {gu && (
          <div className="flex flex-wrap gap-2" aria-label={`${gu} 읍면동`}>
            {(byGu.get(gu) ?? []).map((d) => (
              <ChoiceButton key={d} size="chip" selected={dong === d} onClick={() => update({ dong: d })}>
                {d}
              </ChoiceButton>
            ))}
          </div>
        )}

        {dong && (
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-bg-page px-4 py-3">
            <img src={pinIcon} alt="" width={18} height={18} />
            <p className="text-14 text-text-sub">신청하는 곳</p>
            {office ? (
              <>
                <p className="text-17 font-bold text-text-strong">{office.name}</p>
                <span className="flex-1" />
                {/* 화면에는 '경기도 용인시'를 빼고 구부터 보여 줌 */}
                <p className="text-14 text-text-sub">{office.address?.replace(/^경기도 용인시 /, '')}</p>
              </>
            ) : offices.error ? (
              <>
                <p className="text-15 text-text-sub">불러오지 못했어요.</p>
                <button type="button" onClick={offices.retry} className="text-15 font-medium text-primary underline">
                  다시 시도
                </button>
              </>
            ) : (
              <p className="text-15 text-text-sub">{offices.loading ? '불러오는 중이에요' : `${dong} 행정복지센터`}</p>
            )}
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
