import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import back24Icon from '../../assets/icons/back-24.svg'
import backIcon from '../../assets/icons/back.svg'
import { useSession } from '../../session/SessionContext'
import { AppSidebar } from '../AppSidebar'

interface ResultsLayoutProps {
  /** 제목 위 뒤로 링크 */
  back?: { label: string; to: string }
  /** 제목 앞 아이콘·뒤 칩까지 포함한 제목 줄 */
  title: ReactNode
  /** 제목 줄 오른쪽 */
  titleAside?: ReactNode
  /** 제목 아래 (탭 줄 · 한 줄 설명 등) */
  below?: ReactNode
  /** 오른쪽 352px 열 — 스크롤해도 따라옴 */
  aside?: ReactNode
  /** 큰 글씨 화면: 한 단 840px · 왼쪽 정렬 · 큰 뒤로 링크 (Figma M1) */
  large?: boolean
  children: ReactNode
}

/**
 * 결과 이후 화면 공통 레이아웃 (Figma: 사이드바 264 + 본문 최대 1120 · 왼쪽 + 오른쪽 352)
 * 사이드바를 뺀 본문은 상황 알려 주기 단계와 같이 0.9배 — 큰 글씨 모드에서는 줄이지 않음
 * 1280 미만에서는 오른쪽 열이 아래로 내려감
 */
export function ResultsLayout({ back, title, titleAside, below, aside, large = false, children }: ResultsLayoutProps) {
  const navigate = useNavigate()
  const { mode } = useSession()
  const zoom = mode === '큰 글씨' ? 1 : 0.9
  const width = large ? 'max-w-[840px]' : 'max-w-[1120px]'
  const align = large ? 'items-start' : 'items-center'

  return (
    <div className="flex min-h-screen bg-surface">
      <AppSidebar />

      <main className="flex min-w-0 flex-1 flex-col" style={{ zoom }}>
        <header className={`flex flex-col px-6 pt-16 pb-2 md:px-12 ${align}`}>
          <div className={`flex w-full flex-col ${width} ${large ? 'gap-2.5' : back ? 'gap-1.5' : 'gap-3'}`}>
            {back && (
              <button
                type="button"
                onClick={() => navigate(back.to)}
                className={`flex items-center self-start font-medium hover:text-text-strong ${
                  large ? 'h-9 gap-1 text-19 text-text' : 'h-8 gap-0.5 text-17 text-text-sub'
                }`}
              >
                <img src={large ? back24Icon : backIcon} alt="" className={large ? 'size-6' : 'size-[18px]'} />
                {back.label}
              </button>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {title}
              <span className="flex-1" />
              {titleAside}
            </div>
            {below}
          </div>
        </header>

        <div className={`flex flex-1 flex-col px-6 pt-6 pb-12 md:px-12 ${align}`}>
          <div className={`flex w-full flex-col gap-6 xl:flex-row xl:items-start ${width}`}>
            <div className={`flex min-w-0 flex-1 flex-col ${large ? 'gap-5' : 'gap-4'}`}>{children}</div>
            {aside && <div className="flex w-full flex-col gap-4 xl:sticky xl:top-6 xl:w-[352px] xl:shrink-0">{aside}</div>}
          </div>
        </div>
      </main>
    </div>
  )
}

/** 큰 제목 36 */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="text-36 font-bold text-text-strong">{children}</h1>
}
