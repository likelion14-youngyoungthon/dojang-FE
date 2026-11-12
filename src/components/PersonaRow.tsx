import chevronRightIcon from '../assets/icons/chevron-right-20.svg'
import type { Persona } from '../data/personas'

interface PersonaRowProps {
  persona: Persona
  selected: boolean
  onSelect: () => void
}

/** 체험 인물 한 줄 (Figma: 인물 행) */
export function PersonaRow({ persona, selected, onSelect }: PersonaRowProps) {
  const { age, title, summary, mode } = persona
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex h-[92px] w-full items-center gap-4 rounded-2xl bg-surface pr-5 pl-6 text-left hover:bg-bg-sidebar ${
        selected ? 'border-[1.5px] border-primary' : 'border border-border'
      }`}
    >
      <span className="flex w-16 shrink-0 items-baseline gap-0.5 whitespace-nowrap">
        <span className="text-32 font-bold text-text-strong">{age}</span>
        <span className="text-15 font-medium text-text-sub">세</span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-17 font-bold text-text-strong">{title}</span>
        <span className="truncate text-13 text-text-sub">{summary}</span>
      </span>
      <span className="flex h-[26px] shrink-0 items-center rounded-lg bg-primary-100 px-2 text-13 font-bold whitespace-nowrap text-primary">
        {mode}
      </span>
      <img src={chevronRightIcon} alt="" width={20} height={20} className="shrink-0" />
    </button>
  )
}
