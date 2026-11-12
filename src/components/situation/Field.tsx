import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  title: string
  hint?: string
  children: ReactNode
}

/** 카드 안의 한 묶음: 소제목 22 + 보조 설명 + 내용 (gap 14) */
export function Field({ id, title, hint, children }: FieldProps) {
  return (
    <section aria-labelledby={id} className="flex w-full flex-col gap-3.5">
      <div className="flex flex-wrap items-center gap-x-2">
        <h2 id={id} className="text-22 font-bold text-text-strong">
          {title}
        </h2>
        {hint && <p className="text-14 text-text-sub">{hint}</p>}
      </div>
      {children}
    </section>
  )
}
