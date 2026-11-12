import { useState } from 'react'
import checkWhiteIcon from '../../assets/icons/check-white-16.svg'
import chevronDownIcon from '../../assets/icons/chevron-down-white.svg'
import circleEmptyIcon from '../../assets/icons/circle-empty-white.svg'
import sealPatternIcon from '../../assets/icons/seal-pattern.svg'
import { useSituation } from '../../situation/SituationContext'
import { summarize } from '../../situation/summary'

/** 오른쪽 "내 상황" 카드 (Figma: 내 상황 카드) — 고른 값이 바로 채워짐 */
export function SituationSummaryCard() {
  const { situation } = useSituation()
  const [open, setOpen] = useState(true)
  const rows = summarize(situation)
  const filled = rows.filter((r) => r.lines).length

  return (
    <section
      aria-labelledby="summary-title"
      className="relative flex w-full flex-col gap-4 overflow-hidden rounded-[20px] bg-primary px-6 pt-6 pb-5 shadow-card xl:w-[336px]"
    >
      <img src={sealPatternIcon} alt="" width={280} height={280} className="pointer-events-none absolute -right-[130px] -bottom-40" />

      <div className="relative flex items-center gap-2">
        <h2 id="summary-title" className="text-22 font-bold text-on-primary">
          내 상황
        </h2>
        <span className="flex-1" />
        <span className="text-17 font-bold text-on-primary" aria-label={`6개 중 ${filled}개 채움`}>
          {filled} / {rows.length}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="summary-rows"
          aria-label={open ? '내 상황 접기' : '내 상황 펼치기'}
          className="flex size-5 items-center justify-center"
        >
          <img src={chevronDownIcon} alt="" width={20} height={20} className={open ? '' : '-rotate-90'} />
        </button>
      </div>

      <div className="relative flex h-1.5 gap-1" aria-hidden>
        {rows.map((r) => (
          <span key={r.label} className={`h-1.5 flex-1 rounded-[3px] bg-on-primary ${r.lines ? '' : 'opacity-20'}`} />
        ))}
      </div>

      {open && (
        <dl id="summary-rows" className="relative flex flex-col">
          {rows.map(({ label, lines }) =>
            lines ? (
              <div key={label} className="flex items-start gap-3 py-[11px]">
                <dt className="w-[68px] shrink-0 text-14 text-on-primary opacity-80">{label}</dt>
                <dd className="min-w-0 flex-1 text-17 font-medium break-keep text-on-primary">
                  {lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </dd>
                <span className="flex h-[22px] items-center">
                  <img src={checkWhiteIcon} alt="" width={16} height={16} />
                </span>
              </div>
            ) : (
              <div key={label} className="flex items-center gap-3 py-[11px]">
                <dt className="w-[68px] shrink-0 text-14 text-on-primary opacity-70">{label}</dt>
                <dd className="h-2 w-20 rounded bg-on-primary opacity-20">
                  <span className="sr-only">아직 안 정했어요</span>
                </dd>
                <span className="flex-1" />
                <img src={circleEmptyIcon} alt="" width={14} height={14} />
              </div>
            ),
          )}
        </dl>
      )}
    </section>
  )
}
