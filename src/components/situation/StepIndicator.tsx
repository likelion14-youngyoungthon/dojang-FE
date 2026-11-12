import checkPrimaryIcon from '../../assets/icons/check-primary-14.svg'
import { SITUATION_STEPS } from '../../situation/steps'

/** 4단계 표시 (Figma: 단계 표시) — 완료·지금·다음 */
export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex w-full gap-2" aria-label={`상황 알려 주기 ${SITUATION_STEPS.length}단계 중 ${current}단계`}>
      {SITUATION_STEPS.map(({ label }, i) => {
        const step = i + 1
        const state = step < current ? 'done' : step === current ? 'now' : 'next'
        return (
          <li key={label} aria-current={state === 'now' ? 'step' : undefined} className="flex min-w-0 flex-1 flex-col gap-3">
            <span className={`h-1.5 w-full rounded-[3px] ${state === 'next' ? 'bg-divider' : 'bg-primary'}`} />
            <span className="flex items-center gap-2">
              <span
                className={`flex size-6 shrink-0 items-center justify-center rounded-xl text-13 font-bold ${
                  state === 'done'
                    ? 'bg-primary-100'
                    : state === 'now'
                      ? 'bg-primary text-on-primary'
                      : 'border border-border bg-surface text-icon-off'
                }`}
              >
                {state === 'done' ? <img src={checkPrimaryIcon} alt="완료" width={14} height={14} /> : step}
              </span>
              <span
                className={`truncate text-15 ${
                  state === 'done' ? 'font-medium text-text-sub' : state === 'now' ? 'font-bold text-text-strong' : 'font-medium text-icon-off'
                }`}
              >
                {label}
              </span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
