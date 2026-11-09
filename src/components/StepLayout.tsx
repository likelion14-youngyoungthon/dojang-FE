import type { ReactNode } from 'react'
import { AccessibilityButton } from './AccessibilityButton'
import { IntroPanel } from './IntroPanel'
import { ProgressBar } from './ProgressBar'

export const TOTAL_STEPS = 4

interface StepLayoutProps {
  step: number
  /** 가운데 폼 영역 너비(px). 화면마다 480·520·560·640으로 다름 */
  formWidth: number
  /** 폼 사이 간격. 05 화면만 24px, 나머지는 28px */
  gap?: 'md' | 'lg'
  footer?: ReactNode
  children: ReactNode
}

export function StepLayout({ step, formWidth, gap = 'lg', footer, children }: StepLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <IntroPanel />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col items-center justify-between gap-10 px-6 pt-10 pb-12 md:px-24">
        <div className="flex w-full items-center justify-between">
          <p className="text-[14px] font-medium text-gray-500">
            {step} / {TOTAL_STEPS} 단계
          </p>
          <AccessibilityButton />
        </div>

        <div
          className={`flex w-full flex-col ${gap === 'lg' ? 'gap-7' : 'gap-6'}`}
          style={{ maxWidth: formWidth }}
        >
          <ProgressBar current={step} total={TOTAL_STEPS} />
          {children}
        </div>

        {footer ?? <div className="h-5" aria-hidden />}
      </main>
    </div>
  )
}
