import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import backIcon from '../assets/icons/back.svg'
import { AccessibilityButton } from './AccessibilityButton'
import { FlowSidebar } from './FlowSidebar'

interface FlowLayoutProps {
  /** 사이드바에서 강조할 단계 (1~4) */
  step: number
  /** 상단 "이전 단계로 돌아가기" 이동 경로. 없으면 브라우저 뒤로 가기 */
  backTo?: string
  backLabel?: string
  /** 콘텐츠 최대 너비(px). 기본 760 */
  contentWidth?: number
  /** 13번 이후 넓은 화면: 좌우 여백 56px, 콘텐츠 1008px */
  wide?: boolean
  children: ReactNode
}

/** 06 화면부터 쓰는 공통 레이아웃: 진행 단계 사이드바 + 상단 바 + 콘텐츠 */
export function FlowLayout({
  step,
  backTo,
  backLabel = '이전 단계로 돌아가기',
  contentWidth,
  wide = false,
  children,
}: FlowLayoutProps) {
  const navigate = useNavigate()
  const maxWidth = contentWidth ?? (wide ? 1008 : 760)

  return (
    <div className="flex min-h-screen bg-white">
      <FlowSidebar activeStep={step} />

      <main
        className={`flex min-w-0 flex-1 flex-col gap-6 px-6 pt-9 pb-14 ${wide ? 'md:px-14' : 'md:px-20'}`}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            className="flex items-center gap-1 text-[14px] font-medium text-gray-700 hover:text-gray-900"
          >
            <img src={backIcon} alt="" width={18} height={18} />
            {backLabel}
          </button>
          <AccessibilityButton />
        </div>

        <div
          className={`flex w-full flex-col ${wide ? 'gap-6 pt-4' : 'gap-7 pt-6'}`}
          style={{ maxWidth }}
        >
          {children}
        </div>
      </main>
    </div>
  )
}

export function PageTitle({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h1 className="text-[32px] leading-[1.35] font-bold">{title}</h1>
      {description && <p className="text-[17px] leading-[1.6] text-gray-700">{description}</p>}
    </div>
  )
}
