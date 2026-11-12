import { useNavigate } from 'react-router'
import { LargeBlockView } from '../../../components/results/ModeParts'
import { ResultsLayout } from '../../../components/results/ResultsLayout'
import { getOffice, type Benefit } from '../../../data/results'
import { shortAddress } from '../../../results/modeText'

const CARD = 'flex w-full flex-col rounded-[20px] bg-surface p-9 shadow-card'
const BUTTON = 'flex h-[72px] items-center justify-center rounded-2xl px-8 text-24 font-bold'

/** M1 큰 글씨 — 한 단으로, 글자와 버튼을 크게 (API: POST /judge · GET /services/{id}/steps · GET /offices) */
export function LargeDetail({ benefit }: { benefit: Benefit }) {
  const navigate = useNavigate()
  const office = getOffice(benefit.officeId)
  const [first, ...rest] = benefit.summary.split(' · ')
  // TODO: 큰 글씨 문장이 없는 신청은 요약을 나눠 보여 줌 (GET /services/{id}/steps 연동 전)
  const gets = benefit.large?.gets ?? { label: '받는 것', title: first, sub: rest.join(' · ') }
  const steps = benefit.large?.steps ?? (office ? [`${office.kind}에서 신청서를 써요`, '자격 심사를 기다려요', '결과를 안내받아요'] : [])

  return (
    <ResultsLayout
      large
      back={{ label: '뒤로', to: '/results' }}
      title={<h1 className="text-40 font-bold text-text-strong">{benefit.name}</h1>}
      below={benefit.tagline && <p className="text-22 text-text">{benefit.tagline}</p>}
    >
      <section className={`${CARD} gap-3`}>
        <LargeBlockView {...gets} />
        {benefit.large?.note && <p className="text-19 text-text-sub">{benefit.large.note}</p>}
      </section>

      {office && (
        <section className={`${CARD} gap-6`}>
          <LargeBlockView label="신청하는 곳" title={office.name} sub={`${shortAddress(office)} · 전화 ${office.phone}`} />
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/results/prepare/${office.id}`)}
              className={`${BUTTON} flex-1 bg-primary text-white hover:bg-primary/90`}
            >
              창구 준비하기
            </button>
            <a href={`tel:${office.phone}`} className={`${BUTTON} flex-1 border border-border bg-surface text-text-strong hover:bg-bg-sidebar`}>
              전화하기
            </a>
          </div>
        </section>
      )}

      {steps.length > 0 && (
        <section className={`${CARD} gap-5`}>
          <h2 className="text-19 font-medium text-text-sub">하는 순서</h2>
          <ol className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-22 font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-24 font-medium text-text-strong">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {office && (
        <button
          type="button"
          onClick={() => navigate(`/results/locations?office=${office.id}`)}
          className={`${BUTTON} w-full border border-border bg-surface text-text-strong hover:bg-bg-sidebar`}
        >
          위치 보기
        </button>
      )}
    </ResultsLayout>
  )
}
