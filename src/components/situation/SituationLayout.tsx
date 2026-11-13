import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { useSituation } from '../../situation/SituationContext'
import { SITUATION_STEPS } from '../../situation/steps'
import { isStepComplete } from '../../situation/summary'
import { AppSidebar } from '../AppSidebar'
import { SituationSummaryCard } from './SituationSummaryCard'
import { StepIndicator } from './StepIndicator'

interface SituationLayoutProps {
  /** 1~4 */
  step: number
  title: string
  /** 마지막 단계의 "결과 보기" 등 다음 버튼 동작을 바꿀 때 */
  onNext?: () => void
  /** 다음 버튼 동작이 진행 중 (결과 보기 판정 요청 등) */
  nextBusy?: boolean
  children: ReactNode
}

/**
 * 2 상황 알려 주기 공통 레이아웃 (Figma: 사이드바 264 + 본문)
 * 본문 최대 폭 1120 · 1280 미만에서는 "내 상황" 카드가 본문 아래로 내려감
 */
export function SituationLayout({ step, title, onNext, nextBusy = false, children }: SituationLayoutProps) {
  const navigate = useNavigate()
  const { situation } = useSituation()
  const canNext = isStepComplete(step, situation)
  const isLast = step === SITUATION_STEPS.length
  const prevPath = step > 1 ? SITUATION_STEPS[step - 2].path : '/'
  const goNext = onNext ?? (() => navigate(SITUATION_STEPS[step].path))

  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar activeStep={1} />

      {/* 사이드바를 뺀 본문 전체를 0.9배로 (디자인 대비 10% 축소) */}
      <main className="flex min-w-0 flex-1 flex-col [zoom:0.9]">
        <header className="flex flex-col items-center px-6 pt-12 pb-2 md:px-12">
          <div className="flex w-full max-w-[1120px] flex-col gap-5">
            <StepIndicator current={step} />
            <h1 className="text-36 font-bold text-text-strong">{title}</h1>
          </div>
        </header>

        <div className="flex flex-1 flex-col items-center px-6 pt-6 pb-12 md:px-12">
          <div className="flex w-full max-w-[1120px] flex-col gap-6 xl:flex-row xl:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <div className="flex w-full flex-col gap-7 rounded-[20px] border-[1.5px] border-primary bg-surface p-6 shadow-card sm:p-8">
                {children}
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(prevPath)}
                  className="flex h-14 w-[120px] shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-6 text-17 font-medium text-text-strong hover:bg-bg-sidebar"
                >
                  이전
                </button>
                <span className="flex-1" />
                <p id="next-hint" className="hidden text-14 text-text-sub sm:block">
                  {!canNext ? '모두 고르면 넘어갈 수 있어요' : isLast ? '마지막 단계예요' : `다음 단계 · ${SITUATION_STEPS[step].label}`}
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext || nextBusy}
                  aria-describedby="next-hint"
                  className="flex h-14 w-40 shrink-0 items-center justify-center rounded-xl bg-primary px-6 text-17 font-bold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-border disabled:text-text-sub"
                >
                  {nextBusy ? '정리하는 중' : isLast ? '결과 보기' : '다음'}
                </button>
              </div>
            </div>

            <div className="w-full xl:w-[352px] xl:shrink-0">
              <SituationSummaryCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
