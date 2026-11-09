import type { ReactNode } from 'react'

export type BadgeTone = 'blue' | 'orange' | 'green' | 'gray'

const toneClass: Record<BadgeTone, string> = {
  blue: 'bg-primary-50 text-primary',
  orange: 'bg-warning-50 text-warning',
  green: 'bg-success-50 text-success',
  gray: 'bg-gray-50 text-gray-700',
}

/** 12px 굵은 상태 뱃지 (Figma: Badge) */
export function Badge({
  tone = 'blue',
  className = '',
  children,
}: {
  tone?: BadgeTone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex shrink-0 rounded px-2 py-[3px] text-[12px] leading-[1.5] font-bold ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
