interface ChoiceChipGroupProps<T extends string> {
  label: string
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
}

/** 05 화면의 칩 형태 단일 선택 (Figma: Choices) */
export function ChoiceChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceChipGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`h-[46px] rounded-lg px-[18px] text-[15px] transition-colors ${
              selected
                ? 'bg-primary font-bold text-white'
                : 'border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
