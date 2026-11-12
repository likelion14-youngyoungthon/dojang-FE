import { VIEW_MODES, type ViewMode } from '../data/viewModes'

type BarRole = 'strong' | 'muted' | 'accent' | 'soft' | 'outline'
interface Bar {
  role: BarRole
  /** left · top · width · height · radius (px) */
  box: [number, number, number, number, number]
}

// 모드를 막대로 그린 28×22 미니 화면 (Figma: 맞춤 모드 썸네일)
const THUMBS: Record<ViewMode, Bar[]> = {
  기본: [
    { role: 'strong', box: [4, 4.5, 11, 3, 1.5] },
    { role: 'muted', box: [4, 9.5, 20, 3, 1.5] },
    { role: 'muted', box: [4, 14.5, 15, 3, 1.5] },
  ],
  '큰 글씨': [
    { role: 'strong', box: [4, 3.5, 12, 3, 1.5] },
    { role: 'muted', box: [4, 8, 18, 2, 1] },
    { role: 'accent', box: [4, 12, 20, 6.5, 2] },
  ],
  '쉬운 말': [
    { role: 'soft', box: [4, 4, 6, 6, 1.5] },
    { role: 'muted', box: [12, 5.75, 11, 2.5, 1.25] },
    { role: 'soft', box: [4, 12, 6, 6, 1.5] },
    { role: 'muted', box: [12, 13.75, 8, 2.5, 1.25] },
  ],
  '문자·온라인': [
    { role: 'accent', box: [4, 3.5, 20, 5, 1.5] },
    { role: 'outline', box: [4, 10, 20, 5, 1.5] },
    { role: 'muted', box: [4, 16.5, 9, 2, 1] },
  ],
}

// 고르면 회색 막대가 파랑으로 바뀜
const BAR_COLOR: Record<BarRole, [string, string]> = {
  strong: ['bg-text-strong', 'bg-primary'],
  muted: ['bg-icon-off', 'bg-primary/80'],
  accent: ['bg-primary', 'bg-primary'],
  soft: ['bg-primary-200', 'bg-primary'],
  outline: ['border border-primary bg-white', 'border border-primary bg-white'],
}

function ModeThumb({ mode, selected }: { mode: ViewMode; selected: boolean }) {
  return (
    <span className={`relative h-[22px] w-7 shrink-0 overflow-hidden rounded-[5px] ${selected ? 'bg-primary-100' : 'bg-[#f1f3f7]'}`} aria-hidden>
      {THUMBS[mode].map(({ role, box: [left, top, width, height, radius] }, i) => (
        <span
          key={i}
          className={`absolute ${BAR_COLOR[role][selected ? 1 : 0]}`}
          style={{ left, top, width, height, borderRadius: radius }}
        />
      ))}
    </span>
  )
}

/** 사이드바 아래 맞춤 박스 — 2×2 모드 선택 (Figma: 맞춤 화면 선택 (사이드바)) */
export function ModeGrid({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border-[1.5px] border-primary bg-surface px-2 py-3">
      <p id="mode-grid-label" className="text-13 font-bold text-primary">
        맞춤 화면
      </p>
      <div role="radiogroup" aria-labelledby="mode-grid-label" className="grid grid-cols-2 gap-1.5">
        {VIEW_MODES.map((mode) => {
          const selected = mode === value
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(mode)}
              className={`flex h-[62px] flex-col items-center justify-center gap-1 rounded-lg text-13 whitespace-nowrap ${
                selected
                  ? 'border-[1.5px] border-primary bg-primary-100 font-bold text-primary'
                  : 'border border-border bg-surface font-medium text-text hover:bg-bg-sidebar'
              }`}
            >
              <ModeThumb mode={mode} selected={selected} />
              {mode}
            </button>
          )
        })}
      </div>
    </div>
  )
}
