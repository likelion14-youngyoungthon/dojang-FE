import type { ReactNode } from 'react'
import checkboxOffIcon from '../assets/icons/checkbox-off-sm.svg'
import checkboxOnIcon from '../assets/icons/checkbox-on-sm.svg'

interface CheckItemProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  /** 체크 시 회색 처리 (16 화면 준비 서류) */
  dimWhenChecked?: boolean
  size?: 'md' | 'lg'
  trailing?: ReactNode
  className?: string
}

/** 20px 체크박스 + 텍스트 한 줄 (Figma: Doc / *) */
export function CheckItem({
  checked,
  onChange,
  label,
  dimWhenChecked = false,
  size = 'md',
  trailing,
  className = '',
}: CheckItemProps) {
  return (
    <label className={`flex cursor-pointer items-center ${size === 'lg' ? 'gap-3' : 'gap-2.5'} ${className}`}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <img
        src={checked ? checkboxOnIcon : checkboxOffIcon}
        alt=""
        width={20}
        height={20}
        className="rounded peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2"
      />
      <span
        className={`font-medium ${size === 'lg' ? 'flex-1 text-[16px]' : 'text-[15px]'} ${
          checked && dimWhenChecked ? 'text-gray-500' : ''
        }`}
      >
        {label}
      </span>
      {trailing}
    </label>
  )
}
