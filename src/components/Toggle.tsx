import toggleOffIcon from '../assets/icons/toggle-off.svg'
import toggleOnIcon from '../assets/icons/toggle-on.svg'

interface ToggleRowProps {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** 설명이 있는 스위치 한 줄 (Figma: Toggle / *) */
export function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 border-b border-gray-200 px-5 py-3.5 text-left last:border-b-0 hover:bg-gray-50"
    >
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[16px] font-medium">{label}</span>
        <span className="text-[14px] text-gray-500">{description}</span>
      </span>
      <img src={checked ? toggleOnIcon : toggleOffIcon} alt="" width={48} height={28} />
    </button>
  )
}
