import logoSymbolInverseIcon from '../assets/icons/logo-symbol-inverse.svg'

/**
 * 도장 로고 (E+F 혼합) — 파란 배경용 Inverse 버전 (Figma: Logo / 도장 / Inverse)
 * "도장" 글자 끝에 ㄷ 모노그램 도장을 8° 기울여 찍은 형태
 */
export function Logo() {
  return (
    <div className="flex flex-col items-start gap-[1.64px]" role="img" aria-label="도장 · 용인시 남은 신청 안내">
      <div className="flex items-start gap-[4.1px]" aria-hidden>
        <span className="text-[27.88px] leading-[1.15] font-bold tracking-[-0.03em] text-white">도장</span>
        <span className="pt-[1.64px]">
          <span className="flex size-[17.6px] items-center justify-center">
            <img src={logoSymbolInverseIcon} alt="" width={15.58} height={15.58} className="rotate-8" />
          </span>
        </span>
      </div>
      <span className="text-[9.84px] leading-[1.3] font-medium tracking-normal text-[#ccdefa]" aria-hidden>
        용인시 남은 신청 안내
      </span>
    </div>
  )
}
