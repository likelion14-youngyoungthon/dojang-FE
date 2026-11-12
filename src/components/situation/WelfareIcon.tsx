import { WELFARE_ICONS, type WelfareIconKind } from '../../data/welfare'

/** 20px 복지 아이콘 (Figma: 복지 아이콘) */
export function WelfareIcon({ kind }: { kind: WelfareIconKind }) {
  const { src, inset, bleed } = WELFARE_ICONS[kind]
  return (
    <span className="relative size-5 shrink-0" aria-hidden>
      <span className={`absolute ${inset}`}>
        <img src={src} alt="" className={`absolute block max-w-none ${bleed}`} />
      </span>
    </span>
  )
}
