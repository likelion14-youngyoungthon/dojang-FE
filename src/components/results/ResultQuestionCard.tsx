import type { Benefit } from '../../data/results'
import { formatMonthDay } from '../../results/progress'
import { StageBar } from './StageBar'

interface ResultQuestionCardProps {
  benefit: Benefit
  submittedAt: string | null
  onAnswerYes: () => void
  onAnswerNotYet: () => void
}

/** A2 다시 방문 — 심사 대기 중인 신청의 결과를 묻는 카드 (Figma: 결과 묻기) */
export function ResultQuestionCard({ benefit, submittedAt, onAnswerYes, onAnswerNotYet }: ResultQuestionCardProps) {
  return (
    <section
      aria-labelledby="result-question-title"
      className="flex w-full flex-col gap-[18px] rounded-[20px] border-[1.5px] border-primary bg-surface p-6 shadow-card"
    >
      <div className="flex flex-col gap-0.5">
        <h2 id="result-question-title" className="text-22 font-bold text-text-strong">
          {benefit.name}, 결과가 나왔나요?
        </h2>
        <p className="text-17 text-text-sub">{`${formatMonthDay(submittedAt)} 신청`.trim()} · 자격 심사 중</p>
      </div>
      <StageBar filled={3} caption="3단계 자격 심사" />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAnswerYes}
          className="flex h-12 items-center justify-center rounded-xl bg-primary px-5 text-15 font-bold text-white hover:bg-primary/90"
        >
          결과가 나왔어요
        </button>
        <button
          type="button"
          onClick={onAnswerNotYet}
          className="flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
        >
          아직이에요
        </button>
      </div>
    </section>
  )
}
