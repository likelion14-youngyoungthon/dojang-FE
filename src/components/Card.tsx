import type { ComponentProps, ReactNode } from 'react'
import infoSmIcon from '../assets/icons/info-sm.svg'

/** 흰 배경 + 회색 테두리 카드 (Figma: Card / *) */
export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return (
    <div className={`rounded-[10px] border border-gray-200 bg-white px-6 py-5 ${className}`} {...props} />
  )
}

/** 16px 정보 아이콘 + 회색 안내 문구 (Figma: Note / Privacy note) */
export function InfoNote({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-start gap-2 text-[14px] text-gray-500 ${className}`}>
      <img src={infoSmIcon} alt="" width={16} height={16} className="mt-[3px] shrink-0" />
      <span>{children}</span>
    </p>
  )
}
