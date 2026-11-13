import { Fragment, useState } from 'react'
import { Link, useLocation } from 'react-router'
import chevronDownIcon from '../assets/icons/chevron-down-16.svg'
import menuHistoryOnIcon from '../assets/icons/menu-history-on.svg'
import menuHistoryIcon from '../assets/icons/menu-history.svg'
import menuHistory24Icon from '../assets/icons/menu-history-24.svg'
import menuLaterIcon from '../assets/icons/menu-later.svg'
import menuLater24Icon from '../assets/icons/menu-later-24.svg'
import menuRemainingOffIcon from '../assets/icons/menu-remaining-off.svg'
import menuRemainingIcon from '../assets/icons/menu-remaining.svg'
import menuRemaining24Icon from '../assets/icons/menu-remaining-24.svg'
import { BENEFIT_ICONS, LATER_BENEFITS } from '../data/results'
import { regItemIcon, useRegItems } from '../api/regItems'
import { SEPARATE_APPLICATIONS, WELFARE_ICONS } from '../data/welfare'
import { useResults } from '../results/ResultsContext'
import { formatMonthDay } from '../results/progress'
import { useSession } from '../session/SessionContext'
import { useSituation } from '../situation/SituationContext'
import { AccountMenu } from './AccountMenu'
import { InsetIcon } from './InsetIcon'
import { ModeGrid } from './ModeGrid'
import { SidebarLogo } from './SidebarLogo'

const FLOW = ['상황 고르기', '남은 신청 보기', '신청 진행 관리'] as const

/** 상황 알려 주기 단계에서 쓰는 진행 단계 메뉴 */
function FlowNav({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <nav aria-label="진행 단계" className="flex flex-col px-4 pt-7">
      <p className="px-3 pb-1.5 text-13 font-medium text-text-sub">진행 단계</p>
      <ol className="flex flex-col">
        {FLOW.map((label, i) => {
          const step = i + 1
          const active = step === activeStep
          return (
            <Fragment key={label}>
              {i > 0 && (
                <li aria-hidden className="pl-[23px]">
                  <span className="block h-2 w-0.5 rounded-[1px] bg-primary-200" />
                </li>
              )}
              <li
                aria-current={active ? 'step' : undefined}
                className={`flex h-11 items-center gap-2.5 rounded-[10px] px-3 ${active ? 'bg-primary-100' : ''}`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-xl text-13 font-bold ${
                    active ? 'bg-primary text-white' : 'border-[1.5px] border-border bg-surface text-text-sub'
                  }`}
                >
                  {step}
                </span>
                <span className={`text-15 ${active ? 'font-bold text-primary' : 'font-medium text-text-sub'}`}>{label}</span>
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}

interface MenuRowProps {
  to: string
  label: string
  icon: { on: string; off: string; large: string }
  active: boolean
  count: number
  large: boolean
  /** 큰 글씨·쉬운 말·문자·온라인에서는 숫자를 숨김 (Figma: 선택 · 숫자 없음) */
  showCount: boolean
}

/** 내 신청 메뉴 한 줄 (Figma: 메뉴 행 · 선택 / 기본 / 큰 글씨) */
function MenuRow({ to, label, icon, active, count, large, showCount }: MenuRowProps) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`flex items-center ${large ? 'h-16 gap-3.5 rounded-[14px] px-4' : 'h-11 gap-2.5 rounded-[10px] px-3'} ${
        active ? 'bg-primary-100' : 'hover:bg-primary-100/50'
      }`}
    >
      <img src={large ? (active ? icon.large : icon.off) : active ? icon.on : icon.off} alt="" className={large ? 'size-6' : 'size-5'} />
      <span className={`${large ? 'text-19' : 'text-15'} ${active ? 'font-bold text-primary' : 'font-medium text-text-strong'}`}>{label}</span>
      <span className="flex-1" />
      {showCount &&
        count > 0 &&
        (active ? (
          <span className="flex h-[22px] items-center rounded-full bg-primary px-2 text-13 font-bold text-white">{count}건</span>
        ) : (
          <span className="text-13 font-bold text-text">{count}건</span>
        ))}
    </Link>
  )
}

function FlowLine({ large }: { large: boolean }) {
  return (
    <div aria-hidden className={large ? 'pl-[27px]' : 'pl-[23px]'}>
      <span className="block h-2 w-0.5 rounded-[1px] bg-primary-200" />
    </div>
  )
}

const VISIBLE_HISTORY = 5

/** 결과 이후 화면에서 쓰는 "내 신청" 메뉴 (Figma: 사이드바 · 내 신청) */
function ResultsNav() {
  const { pathname } = useLocation()
  const { mode } = useSession()
  const { situation } = useSituation()
  const { items: regItems } = useRegItems()
  const { remaining, applied } = useResults()
  const [expanded, setExpanded] = useState(false)
  const large = mode === '큰 글씨'
  const showCount = mode === '기본'

  // 신청 기록 = 여기서 신청한 것 + 장애 등록 때 같이 신청한 것 + 따로 신청한 것 (Figma 4세 예시: 5 + 2 = 7)
  const history = [
    ...applied.map(({ benefit, submittedAt }) => ({
      key: benefit.id,
      name: benefit.name,
      icon: BENEFIT_ICONS[benefit.icon],
      sub: `${formatMonthDay(submittedAt)} 신청`,
      to: `/history/${benefit.id}`,
    })),
    ...regItems.filter((w) => situation.bundle.includes(w.id)).map((w) => ({
      key: w.id,
      name: w.easy_label,
      icon: WELFARE_ICONS[regItemIcon(w.category)],
      sub: '등록 때 신청',
      to: null,
    })),
    ...SEPARATE_APPLICATIONS.filter((w) => situation.separate[w.id]).map((w) => ({
      key: w.id,
      name: w.name,
      icon: WELFARE_ICONS[w.icon],
      sub: situation.separate[w.id],
      to: null,
    })),
  ]
  const shown = expanded ? history : history.slice(0, VISIBLE_HISTORY)
  const hiddenCount = history.length - VISIBLE_HISTORY
  const onHistory = pathname.startsWith('/history')

  return (
    <nav aria-label="내 신청" className="flex flex-col px-4 pt-7">
      <p className="px-3 pb-1.5 text-13 font-medium text-text-sub">내 신청</p>
      <MenuRow
        to="/results"
        label="남은 신청"
        icon={{ on: menuRemainingIcon, off: menuRemainingOffIcon, large: menuRemaining24Icon }}
        active={pathname.startsWith('/results')}
        count={remaining.length}
        large={large}
        showCount={showCount}
      />
      <FlowLine large={large} />
      <MenuRow
        to={applied.length > 0 ? `/history/${applied[0].benefit.id}` : '/results'}
        label="신청 기록"
        icon={{ on: menuHistoryOnIcon, off: large ? menuHistory24Icon : menuHistoryIcon, large: menuHistoryOnIcon }}
        active={onHistory}
        count={history.length}
        large={large}
        showCount={showCount}
      />

      {history.length > 0 ? (
        <div className={`flex gap-[13px] ${large ? 'pl-[27px]' : 'pl-[23px]'}`}>
          <span aria-hidden className="w-0.5 shrink-0 self-stretch bg-primary-200" />
          <ul className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5 pb-1.5">
            {shown.map((item) => {
              const current = item.to === pathname
              const body = (
                <>
                  <span className="flex items-center gap-1.5">
                    <InsetIcon src={item.icon.src} inset={item.icon.inset} bleed={item.icon.bleed} className="size-4" />
                    <span className={`min-w-0 flex-1 truncate text-15 ${current ? 'font-bold text-primary' : 'font-medium text-text-strong'}`}>
                      {item.name}
                    </span>
                  </span>
                  <span className="text-13 text-text-sub">{item.sub}</span>
                </>
              )
              return (
                <li key={item.key}>
                  {item.to ? (
                    <Link to={item.to} aria-current={current ? 'page' : undefined} className="flex flex-col py-1 hover:opacity-80">
                      {body}
                    </Link>
                  ) : (
                    <div className="flex flex-col py-1">{body}</div>
                  )}
                </li>
              )
            })}
            {hiddenCount > 0 && (
              <li>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((v) => !v)}
                  className="flex items-center gap-0.5 py-1 text-13 font-medium text-icon hover:text-text"
                >
                  {expanded ? '접기' : `더보기 · ${hiddenCount}건`}
                  <img src={chevronDownIcon} alt="" width={16} height={16} className={expanded ? 'rotate-180' : ''} />
                </button>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <FlowLine large={large} />
      )}

      <MenuRow
        to="/results#later"
        label="나중에 가능"
        icon={{ on: menuLaterIcon, off: large ? menuLater24Icon : menuLaterIcon, large: menuLater24Icon }}
        active={false}
        count={LATER_BENEFITS.length}
        large={large}
        showCount={showCount}
      />
    </nav>
  )
}

interface AppSidebarProps {
  /** 상황 알려 주기 단계면 진행 단계 메뉴, 없으면 결과 이후의 내 신청 메뉴 */
  activeStep?: 1 | 2 | 3
}

/** 왼쪽 고정 사이드바 (Figma: 사이드바 264) */
export function AppSidebar({ activeStep }: AppSidebarProps) {
  const { mode, setMode } = useSession()
  return (
    <aside className="sticky top-0 z-20 hidden h-screen w-[264px] shrink-0 flex-col bg-bg-sidebar lg:flex">
      <div className="px-6 pt-7">
        <SidebarLogo />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">{activeStep ? <FlowNav activeStep={activeStep} /> : <ResultsNav />}</div>

      <div className="px-4 pt-3 pb-3">
        <ModeGrid value={mode} onChange={setMode} />
      </div>

      <AccountMenu />
    </aside>
  )
}
