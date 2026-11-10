import { Logo } from './Logo'

/** 모든 시작 단계 화면 왼쪽에 고정되는 파란 소개 패널 (Figma: Intro panel) */
export function IntroPanel() {
  return (
    <aside className="sticky top-0 hidden h-screen min-h-[640px] w-[560px] shrink-0 flex-col justify-between bg-primary px-16 pt-12 pb-14 text-white lg:flex">
      <Logo />

      <div className="flex flex-col gap-5">
        <h1 className="text-[38px] leading-[1.35] font-bold">
          제도 이름을 몰라도
          <br />
          내 상황을 이야기하면
          <br />
          남은 신청을 정리해 드려요
        </h1>
        <p className="text-[16px] leading-[1.6] opacity-85">
          중앙정부·경기도·용인시 지원을 공식 근거와 함께 연결하고,
          <br />
          신청 준비부터 진행 상황까지 이어서 챙겨 드려요.
        </p>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/25 pt-6">
        <p className="text-[34px] leading-[1.3] font-bold">38,206명</p>
        <p className="text-[14px] opacity-75">용인시 등록장애인 수 · 2025년 12월 31일 기준</p>
      </div>
    </aside>
  )
}
