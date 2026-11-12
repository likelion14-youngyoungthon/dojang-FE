import type { ComponentProps } from 'react'

interface ChoiceButtonProps extends Omit<ComponentProps<'button'>, 'type'> {
  selected: boolean
  /** tile: 52px 칸(가로로 나눠 채움), chip: 40px 칸(글자 폭) */
  size?: 'tile' | 'chip'
}

/** 고르는 칸 (Figma: 선택 · 선택 칸) */
export function ChoiceButton({ selected, size = 'tile', className = '', children, ...props }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`flex items-center justify-center rounded-[10px] text-17 whitespace-nowrap ${
        size === 'tile' ? 'h-13 min-w-0 flex-1 basis-0 px-3' : 'h-10 shrink-0 px-3.5'
      } ${
        selected
          ? 'border-[1.5px] border-primary bg-primary-100 font-bold text-primary'
          : 'bg-neutral-100 font-medium text-text-strong hover:bg-divider'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
