import logoSymbolIcon from '../assets/icons/logo-symbol.svg'

/**
 * 디딤 로고 Default — 시작 화면용 큰 로고
 * "디딤" 글자 끝에 ㄷ 모노그램 도장을 8° 기울여 찍은 형태
 */
export function Logo() {
  return (
    <div className="flex flex-col items-start gap-[4.2px]" role="img" aria-label="디딤 · 용인시 남은 신청 안내">
      <div className="flex items-start gap-[10.5px]" aria-hidden>
        <span className="text-[71.4px] leading-[1.15] font-bold tracking-[-0.03em] text-text-strong">디딤</span>
        <span className="pt-[4.2px]">
          <span className="flex size-[45.065px] items-center justify-center">
            <img src={logoSymbolIcon} alt="" width={39.9} height={39.9} className="rotate-8" />
          </span>
        </span>
      </div>
      <span className="text-[25.2px] leading-[1.3] font-medium text-primary" aria-hidden>
        용인시 남은 신청 안내
      </span>
    </div>
  )
}
