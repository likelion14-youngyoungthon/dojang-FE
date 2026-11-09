import checkboxOffIcon from '../assets/icons/checkbox-off-sm.svg'
import checkboxOnIcon from '../assets/icons/checkbox-on-sm.svg'
import radioOffIcon from '../assets/icons/radio-off-sm.svg'
import radioOnIcon from '../assets/icons/radio-on-sm.svg'

interface OptionTileProps {
  type: 'radio' | 'checkbox'
  label: string
  selected: boolean
  onSelect: () => void
}

/** 50px 높이 선택 타일 (Figma: Option / *) — 단일·복수 선택 공용 */
export function OptionTile({ type, label, selected, onSelect }: OptionTileProps) {
  const icon =
    type === 'radio' ? (selected ? radioOnIcon : radioOffIcon) : selected ? checkboxOnIcon : checkboxOffIcon

  return (
    <button
      type="button"
      role={type}
      aria-checked={selected}
      onClick={onSelect}
      className={`flex h-[50px] items-center gap-2.5 rounded-lg px-4 text-left text-[15px] transition-colors ${
        selected
          ? 'border-[1.5px] border-primary bg-primary-50 font-bold'
          : 'border border-gray-300 bg-white font-medium hover:bg-gray-50'
      }`}
    >
      <img src={icon} alt="" width={20} height={20} />
      {label}
    </button>
  )
}

interface OptionGroupProps<T extends string> {
  label: string
  options: readonly T[]
  columns?: 2 | 3
}

interface RadioGroupProps<T extends string> extends OptionGroupProps<T> {
  value: T | null
  onChange: (value: T) => void
}

export function RadioTileGroup<T extends string>({
  label,
  options,
  columns = 2,
  value,
  onChange,
}: RadioGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`grid gap-x-3 gap-y-2.5 ${columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
    >
      {options.map((option) => (
        <OptionTile
          key={option}
          type="radio"
          label={option}
          selected={value === option}
          onSelect={() => onChange(option)}
        />
      ))}
    </div>
  )
}

interface CheckboxGroupProps<T extends string> extends OptionGroupProps<T> {
  values: readonly T[]
  onChange: (values: T[]) => void
}

export function CheckboxTileGroup<T extends string>({
  label,
  options,
  columns = 2,
  values,
  onChange,
}: CheckboxGroupProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`grid gap-x-3 gap-y-2.5 ${columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}
    >
      {options.map((option) => {
        const selected = values.includes(option)
        return (
          <OptionTile
            key={option}
            type="checkbox"
            label={option}
            selected={selected}
            onSelect={() =>
              onChange(selected ? values.filter((v) => v !== option) : [...values, option])
            }
          />
        )
      })}
    </div>
  )
}
