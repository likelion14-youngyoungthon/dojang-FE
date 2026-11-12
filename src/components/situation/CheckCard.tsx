import checkWhiteIcon from '../../assets/icons/check-white-14.svg'
import type { WelfareIconKind } from '../../data/welfare'
import { WelfareIcon } from './WelfareIcon'

interface CheckCardProps {
  checked: boolean
  label: string
  sub?: string
  icon?: WelfareIconKind
  onToggle: () => void
}

/** 체크 선택지 (Figma: 체크 선택지) — 보조 문구가 없으면 52px 한 줄 */
export function CheckCard({ checked, label, sub, icon, onToggle }: CheckCardProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-4 text-left ${sub ? 'py-2.5' : 'h-13'} ${
        checked ? 'border-[1.5px] border-primary bg-primary-100' : 'border border-border bg-surface hover:bg-bg-sidebar'
      }`}
    >
      {checked ? (
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-md bg-primary">
          <img src={checkWhiteIcon} alt="" width={14} height={14} />
        </span>
      ) : (
        <span className="size-[22px] shrink-0 rounded-md border-[1.5px] border-border bg-surface" />
      )}
      {icon && <WelfareIcon kind={icon} />}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`text-17 ${checked ? 'font-bold text-primary' : 'font-medium text-text-strong'}`}>{label}</span>
        {sub && <span className="text-14 text-text-sub">{sub}</span>}
      </span>
    </button>
  )
}
