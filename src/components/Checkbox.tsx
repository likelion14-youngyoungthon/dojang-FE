import type { ReactNode } from 'react'
import checkboxCheckedIcon from '../assets/icons/checkbox-checked.svg'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
  className?: string
}

export function Checkbox({ checked, onChange, children, className = '' }: CheckboxProps) {
  return (
    <label className={`flex cursor-pointer gap-2.5 ${className}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="flex size-[22px] shrink-0 rounded-[5px] peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
        {checked ? (
          <img src={checkboxCheckedIcon} alt="" width={22} height={22} />
        ) : (
          <span className="size-full rounded-[5px] border-[1.5px] border-gray-300 bg-white" />
        )}
      </span>
      {children}
    </label>
  )
}
