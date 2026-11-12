import type { ReactNode } from 'react'
import { IntroShowcase } from './IntroShowcase'
import { Logo } from './Logo'

interface StartLayoutProps {
  /** 로고 아래 내용 사이 간격: A1은 32px, A1-2는 24px */
  gap?: 'md' | 'lg'
  footer: ReactNode
  showModeCaption?: boolean
  children: ReactNode
}

/**
 * 1 시작 단계 공통 레이아웃 (Figma: 시작 패널 520 + 소개 면)
 * 1280 미만에서는 소개 면이 시작 패널 아래로 내려감
 */
export function StartLayout({ gap = 'lg', footer, showModeCaption, children }: StartLayoutProps) {
  return (
    // 버튼·링크만 마우스로 반응하고, 나머지(글자·그림)는 드래그·선택·클릭이 안 되도록 막음
    <div className="pointer-events-none flex min-h-screen flex-col bg-bg-page select-none xl:flex-row [&_a]:pointer-events-auto [&_a_*]:pointer-events-none [&_button]:pointer-events-auto [&_button_*]:pointer-events-none">
      <main className="flex w-full shrink-0 flex-col bg-surface px-6 pt-7 pb-8 sm:px-10 xl:min-h-screen xl:w-[520px] xl:border-r xl:border-divider">
        <div className="flex-1" />
        <div className={`mx-auto flex w-full max-w-[440px] flex-col ${gap === 'lg' ? 'gap-8' : 'gap-6'}`}>
          <Logo />
          {children}
        </div>
        <div className="min-h-10 flex-1" />
        <div className="mx-auto w-full max-w-[440px]">{footer}</div>
      </main>

      <IntroShowcase showModeCaption={showModeCaption} />
    </div>
  )
}
