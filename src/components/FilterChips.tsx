interface FilterChipsProps<T extends string> {
  label: string
  options: readonly T[]
  value: T | '전체'
  onChange: (value: T | '전체') => void
  /** md: 38px/14px (21 화면), sm: 36px/13px (22 화면) */
  size?: 'sm' | 'md'
}

/** 둥근 필터 칩 — 선택 시 검정 배경 (Figma: Filters) */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
}: FilterChipsProps<T>) {
  const all = ['전체', ...options] as const
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {all.map((option) => {
        const selected = option === value
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option as T | '전체')}
            className={`rounded-full ${size === 'md' ? 'h-[38px] px-4 text-[14px]' : 'h-9 px-3.5 text-[13px]'} ${
              selected
                ? 'bg-gray-900 font-bold text-white'
                : 'border border-gray-300 bg-white font-medium hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
