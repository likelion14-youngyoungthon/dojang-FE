import type { ComponentProps } from 'react'
import chevronDownIcon from '../assets/icons/chevron-down.svg'

interface SelectProps extends ComponentProps<'select'> {
  options: readonly string[]
}

/** 52px 높이 드롭다운 (Figma: Select) */
export function Select({ options, className = '', ...props }: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        className="h-13 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white pr-12 pl-4 text-[16px] font-medium text-gray-900 focus:border-primary focus:outline-none"
        {...props}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <img
        src={chevronDownIcon}
        alt=""
        width={22}
        height={22}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />
    </div>
  )
}
