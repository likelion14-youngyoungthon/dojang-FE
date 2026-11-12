import didimSymbolIcon from '../assets/icons/didim-symbol.svg'

/** 사이드바용 작은 디딤 로고 (Figma: 디딤/로고) — 글자 끝에 ㄷ 심볼을 8° 기울여 찍은 형태 */
export function SidebarLogo() {
  return (
    <div className="flex flex-col items-start gap-0.5" role="img" aria-label="디딤 · 남은 신청, 한 걸음씩 끝까지">
      <div className="flex items-start gap-[5px]" aria-hidden>
        <span className="text-[34px] leading-[1.15] font-bold tracking-[-0.03em] text-text-strong">디딤</span>
        <span className="pt-0.5">
          <span className="flex size-[21.459px] items-center justify-center">
            <img src={didimSymbolIcon} alt="" width={19} height={19} className="rotate-8" />
          </span>
        </span>
      </div>
      <span className="text-12 font-medium text-text-sub" aria-hidden>
        남은 신청, 한 걸음씩 끝까지
      </span>
    </div>
  )
}
