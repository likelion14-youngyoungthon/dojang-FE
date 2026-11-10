import checkIcon from '../assets/icons/check.svg'
import { Logo } from './Logo'

const FLOW_STEPS = ['상황 설명하기', '상황 확인하기', '남은 신청 보기', '신청 진행 관리'] as const

/** 06 화면부터 왼쪽에 고정되는 진행 단계 사이드바 (Figma: Flow sidebar) */
export function FlowSidebar({ activeStep }: { activeStep: number }) {
  return (
    <aside className="sticky top-0 hidden h-screen min-h-150 w-[320px] shrink-0 flex-col justify-between bg-primary px-8 py-10 text-white lg:flex">
      <div className="flex flex-col gap-12">
        <Logo />

        <nav aria-label="진행 단계" className="flex flex-col gap-1">
          <p className="text-[13px] font-medium opacity-60">진행 단계</p>
          <ol className="flex flex-col gap-1">
            {FLOW_STEPS.map((label, i) => {
              const step = i + 1
              const active = step === activeStep
              const done = step < activeStep
              return (
                <li
                  key={label}
                  aria-current={active ? 'step' : undefined}
                  className={`flex items-center gap-3 rounded-lg p-3 ${active ? 'bg-white/14' : ''}`}
                >
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-[13px] font-bold ${
                      active || done ? 'bg-white text-primary' : 'border-[1.5px] border-white/50 opacity-80'
                    }`}
                  >
                    {done ? <img src={checkIcon} alt="완료" width={14} height={14} /> : step}
                  </span>
                  <span
                    className={`text-[16px] ${
                      active ? 'font-bold' : done ? 'font-medium' : 'font-medium opacity-60'
                    }`}
                  >
                    {label}
                  </span>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>

      <p className="border-t border-white/25 pt-5 text-[13px] opacity-80">
        실제 자격은 담당 창구에서 최종 확인됩니다.
      </p>
    </aside>
  )
}
