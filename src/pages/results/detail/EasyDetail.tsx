import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import buildingIcon from '../../../assets/icons/building-32.svg'
import phoneDarkIcon from '../../../assets/icons/phone-dark-20.svg'
import pinWhiteIcon from '../../../assets/icons/pin-white.svg'
import { Card } from '../../../components/results/Card'
import { EasyGroupCard, EasyRow } from '../../../components/results/ModeParts'
import { PageTitle, ResultsLayout } from '../../../components/results/ResultsLayout'
import { BenefitTile } from '../../../components/results/Tiles'
import { getOffice, type Benefit } from '../../../data/results'

/** M3 쉬운 말 — 짧은 문장과 그림으로 (API: POST /judge · GET /services/{id}/basis · GET /offices) */
export function EasyDetail({ benefit, toggle }: { benefit: Benefit; toggle: ReactNode }) {
  const navigate = useNavigate()
  const office = getOffice(benefit.officeId)
  const easy = benefit.easy

  return (
    <ResultsLayout
      back={{ label: '남은 신청', to: '/results' }}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <BenefitTile kind={benefit.icon} />
          <PageTitle>{benefit.name}</PageTitle>
        </div>
      }
      titleAside={toggle}
      below={(easy?.summary ?? benefit.tagline) && <p className="text-17 text-text">{easy?.summary ?? benefit.tagline}</p>}
      aside={
        <>
          {office && (
            <Card className="gap-4 p-6">
              <div className="flex items-center gap-4">
                <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary-100">
                  <img src={buildingIcon} alt="" width={32} height={32} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <p className="text-13 font-medium text-text-sub">신청하는 곳</p>
                  <p className="text-22 font-bold text-text-strong">{office.name}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/results/locations?office=${office.id}`)}
                  className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-17 font-bold text-white hover:bg-primary/90"
                >
                  <img src={pinWhiteIcon} alt="" width={20} height={20} />
                  가는 길 보기
                </button>
                <a
                  href={`tel:${office.phone}`}
                  className="flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-6 text-17 font-medium text-text-strong hover:bg-bg-sidebar"
                >
                  <img src={phoneDarkIcon} alt="" width={20} height={20} />
                  전화하기
                </a>
              </div>
            </Card>
          )}
          {easy?.glossary && easy.glossary.length > 0 && (
            <Card className="gap-1.5 p-6">
              <p className="text-13 font-medium text-text-sub">어려운 말</p>
              {easy.glossary.map((term, i) => (
                <div key={term.word} className={i > 0 ? 'mt-3' : ''}>
                  <p className="text-22 font-bold text-text-strong">{term.word}</p>
                  <p className="text-17 text-text">{term.meaning}</p>
                </div>
              ))}
            </Card>
          )}
        </>
      }
    >
      {easy?.groups.map((group) => (
        <EasyGroupCard key={group.title} title={group.title}>
          {group.items.map((item) => (
            <EasyRow key={item.text} {...item} />
          ))}
        </EasyGroupCard>
      ))}
    </ResultsLayout>
  )
}
