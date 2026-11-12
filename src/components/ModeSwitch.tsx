import { VIEW_MODES, type ViewMode } from '../data/viewModes'

/** 맞춤 화면 전환 세그먼트 (Figma: 맞춤 화면 전환) — 지금은 보여주기용 */
export function ModeSwitch({ value }: { value: ViewMode }) {
  return (
    <div className="flex h-11 items-start gap-1 rounded-xl bg-neutral-100 p-1">
      {VIEW_MODES.map((mode) => (
        <span
          key={mode}
          className={`flex h-full shrink-0 items-center justify-center rounded-lg px-1.5 text-13 whitespace-nowrap ${
            mode === value
              ? 'bg-surface font-bold text-primary drop-shadow-[0_1px_1.5px_rgb(25_31_40/0.12)]'
              : 'font-medium text-text'
          }`}
        >
          {mode}
        </span>
      ))}
    </div>
  )
}
