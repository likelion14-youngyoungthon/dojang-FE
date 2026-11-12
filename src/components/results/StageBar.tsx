/** 신청 단계 수 — TODO: GET /services/{id}/steps 길이로 */
export const STEP_COUNT = 4

interface StageBarProps {
  /** 지금까지 채운 칸 수 */
  filled: number
  /** 막대 아래 "3단계 자격 심사 · 4단계 중 3단계" 줄 */
  caption?: string
}

/** 단계 막대 간단 (Figma) — 4칸 중 지나온 칸만 파랑 */
export function StageBar({ filled, caption }: StageBarProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={STEP_COUNT}
        aria-valuenow={filled}
        aria-label={`${STEP_COUNT}단계 중 ${filled}단계`}
        className="flex w-full gap-1.5"
      >
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-sm ${i < filled ? 'bg-primary' : 'bg-divider'}`} />
        ))}
      </div>
      {caption && (
        <div className="flex items-center">
          <p className="text-13 font-bold text-text-strong">{caption}</p>
          <span className="flex-1" />
          <p className="text-14 text-text-sub">
            {STEP_COUNT}단계 중 {filled}단계
          </p>
        </div>
      )}
    </div>
  )
}
