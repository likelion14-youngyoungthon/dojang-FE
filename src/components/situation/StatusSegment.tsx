import { APPLICATION_STATUSES, type ApplicationProgress } from '../../data/welfare'

interface StatusSegmentProps {
  label: string
  value: ApplicationProgress
  onChange: (value: ApplicationProgress) => void
}

/** 따로 신청한 것의 지금 상태 고르기 (Figma: 상태 고르기) */
export function StatusSegment({ label, value, onChange }: StatusSegmentProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-primary-100 py-2.5 pr-3 pl-4 sm:col-span-2">
      <p className="text-15 font-medium text-text-strong">{label}, 지금 어떤가요?</p>
      <span className="flex-1" />
      <div role="radiogroup" aria-label={`${label} 지금 상태`} className="flex h-12 w-[300px] max-w-full gap-0.5 rounded-xl bg-neutral-100 p-1">
        {APPLICATION_STATUSES.map((status) => {
          const selected = status === value
          return (
            <button
              key={status}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(status)}
              className={`flex min-w-0 flex-1 items-center justify-center rounded-lg text-15 whitespace-nowrap ${
                selected ? 'bg-surface font-bold text-primary shadow-[0_1px_3px_rgb(25_31_40/0.12)]' : 'font-medium text-text-sub'
              }`}
            >
              {status}
            </button>
          )
        })}
      </div>
    </div>
  )
}
