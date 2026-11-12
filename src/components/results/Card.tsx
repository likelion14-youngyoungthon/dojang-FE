import type { ComponentProps, ReactNode } from 'react'

/** 흰 카드 (Figma: 카드 · 카드 그림자) */
export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`flex w-full flex-col overflow-hidden rounded-[20px] bg-surface shadow-card ${className}`} {...props} />
}

/** 카드 머리: 소제목 22 + 숫자 + 오른쪽 요소 */
export function CardHeader({ title, count, children, className = 'pt-[18px] pb-3' }: { title: string; count?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 px-6 ${className}`}>
      <h2 className="text-22 font-bold text-text-strong">{title}</h2>
      {count && <span className="text-17 font-bold text-primary">{count}</span>}
      <span className="flex-1" />
      {children}
    </div>
  )
}

/** 왼쪽 라벨(96px) + 값 줄, 사이에 선 (Figma: 요약 행) */
export function KeyValueList({ rows, lastDivider = false }: { rows: { label: string; value: ReactNode }[]; lastDivider?: boolean }) {
  return (
    <dl className="flex w-full flex-col">
      {rows.map(({ label, value }, i) => (
        <div key={label} className={`flex items-start gap-4 py-[11px] text-17 ${i < rows.length - 1 || lastDivider ? 'border-b border-divider' : ''}`}>
          <dt className="w-24 shrink-0 text-text-sub">{label}</dt>
          <dd className="min-w-0 flex-1 font-medium text-text-strong">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
