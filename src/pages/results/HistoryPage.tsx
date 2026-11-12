import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import checkIcon from '../../assets/icons/check-primary-16.svg'
import sealPatternIcon from '../../assets/icons/seal-pattern.svg'
import { Card } from '../../components/results/Card'
import { OfficeInfoCard } from '../../components/results/OfficeInfoCard'
import { PageTitle, ResultsLayout } from '../../components/results/ResultsLayout'
import { StatusChangeModal } from '../../components/results/StatusChangeModal'
import { BenefitTile } from '../../components/results/Tiles'
import { StatusChip } from '../../components/StatusChip'
import { getOffice } from '../../data/results'
import { currentStep, getApplySteps } from '../../results/progress'
import { useResults } from '../../results/ResultsContext'
import { STEP_COUNT } from '../../components/results/StageBar'

/** L3 신청 단계 · 18 상태 변경 확인 (API: GET /services/{id}/steps · PUT /me/progress · GET /offices) */
export function HistoryPage() {
  const { benefitId } = useParams()
  const { applied, setStage } = useResults()
  const [confirming, setConfirming] = useState(false)
  const record = applied.find((a) => a.benefit.id === benefitId)
  if (!record) return <Navigate to="/results" replace />

  const { benefit, stage } = record
  const office = getOffice(benefit.officeId)
  const steps = getApplySteps(benefit, record)
  const now = currentStep(record)
  const done = stage === 'approved'

  return (
    <ResultsLayout
      back={{ label: '남은 신청', to: '/results' }}
      title={
        <div className="flex flex-wrap items-center gap-3">
          <BenefitTile kind={benefit.icon} />
          <PageTitle>{benefit.name}</PageTitle>
          <StatusChip status={stage} />
        </div>
      }
      aside={office && <OfficeInfoCard office={office} />}
    >
      <section
        aria-label="지금 단계"
        className="relative flex w-full flex-col gap-1 overflow-hidden rounded-[20px] bg-primary px-7 py-6 text-on-primary"
      >
        <img src={sealPatternIcon} alt="" width={280} height={280} className="pointer-events-none absolute -right-[130px] -bottom-40" />
        <p className="relative text-14 font-medium">
          {benefit.name} · {STEP_COUNT}단계 중 {now}단계
        </p>
        <p className="relative text-36 font-bold">{steps[now - 1].title}</p>
      </section>

      <Card className="gap-5 p-6">
        <ol className="flex flex-col">
          {steps.map((step, i) => {
            const n = i + 1
            const passed = n < now || done
            const current = n === now && !done
            return (
              <li
                key={step.title}
                aria-current={current ? 'step' : undefined}
                className={`flex flex-col gap-5 ${i > 0 ? 'mt-5 border-t border-divider pt-5' : ''}`}
              >
                  <div className="flex items-center gap-3.5">
                    {passed ? (
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
                        <img src={checkIcon} alt="마침" width={16} height={16} />
                      </span>
                    ) : (
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-17 font-bold ${
                          current ? 'bg-primary text-white' : 'border-[1.5px] border-border bg-surface text-text-sub'
                        }`}
                      >
                        {n}
                      </span>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className={`text-22 font-bold ${passed || current ? 'text-text-strong' : 'text-text-sub'}`}>{step.title}</p>
                      {(passed || current) && step.sub && <p className="text-17 text-text-sub">{step.sub}</p>}
                    </div>
                    {current && (
                      <span className="flex h-[26px] items-center rounded-lg bg-primary-100 px-2 text-13 font-bold text-primary">지금</span>
                    )}
                  </div>
                  {current && n === 3 && (
                    <div className="pl-[46px]">
                      <button
                        type="button"
                        onClick={() => setConfirming(true)}
                        className="flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-15 font-bold text-white hover:bg-primary/90"
                      >
                        결과가 나왔어요
                      </button>
                    </div>
                  )}
              </li>
            )
          })}
        </ol>
      </Card>

      {confirming && (
        <StatusChangeModal
          benefitName={benefit.name}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setStage(benefit.id, 'approved')
            setConfirming(false)
          }}
        />
      )}
    </ResultsLayout>
  )
}
