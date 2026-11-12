/**
 * Figma 아이콘 그대로 배치 — 정사각 칸 안에서 그림 영역(inset)과 선 굵기 여유(bleed)를 퍼센트로 지정
 * 크기는 className(size-*)으로 정함. tint를 주면 그림 모양만 따서 그 색(bg-*)으로 칠함 (흰 타일 위 파란 아이콘 등)
 */
export function InsetIcon({ src, inset, bleed, className, tint }: { src: string; inset: string; bleed: string; className: string; tint?: string }) {
  return (
    <span className={`relative shrink-0 ${className}`} aria-hidden>
      <span className={`absolute ${inset}`}>
        {tint ? (
          <span
            className={`absolute block ${bleed} ${tint}`}
            style={{ maskImage: `url("${src}")`, maskSize: '100% 100%', maskRepeat: 'no-repeat' }}
          />
        ) : (
          <img src={src} alt="" className={`absolute block max-w-none ${bleed}`} />
        )}
      </span>
    </span>
  )
}
