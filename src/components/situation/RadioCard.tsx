import checkWhiteIcon from '../../assets/icons/check-white-14.svg'

interface RadioCardProps {
  selected: boolean
  label: string
  sub?: string
  onSelect: () => void
}

/** 라디오 선택지 (Figma: 선택지) */
export function RadioCard({ selected, label, sub, onSelect }: RadioCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl py-3 pr-4 pl-5 text-left ${
        selected ? 'border-[1.5px] border-primary bg-primary-100' : 'border border-border bg-surface hover:bg-bg-sidebar'
      }`}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`text-17 ${selected ? 'font-bold text-primary' : 'font-medium text-text-strong'}`}>{label}</span>
        {sub && <span className="text-14 text-text-sub">{sub}</span>}
      </span>
      {selected ? (
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary">
          <img src={checkWhiteIcon} alt="" width={14} height={14} />
        </span>
      ) : (
        <span className="size-[22px] shrink-0 rounded-full border-[1.5px] border-border bg-surface" />
      )}
    </button>
  )
}
