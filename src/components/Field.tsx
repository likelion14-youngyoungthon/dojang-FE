import type { ReactNode } from 'react'

interface FieldProps {
  label: string
  htmlFor?: string
  hint?: string
  hintId?: string
  className?: string
  children: ReactNode
}

/** 굵은 라벨 + 입력 요소 + 보조 문구 묶음 (Figma: Field / *) */
export function Field({ label, htmlFor, hint, hintId, className = '', children }: FieldProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-[15px] font-bold">
        {label}
      </label>
      {children}
      {hint && (
        <p id={hintId} className="text-[14px] text-gray-500">
          {hint}
        </p>
      )}
    </div>
  )
}
