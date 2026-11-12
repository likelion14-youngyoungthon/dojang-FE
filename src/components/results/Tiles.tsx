import { BENEFIT_ICONS, PLACE_ICONS, type BenefitIconKind, type PlaceIconKind } from '../../data/results'
import { InsetIcon } from '../InsetIcon'

/** 복지 타일 — 연파랑 원 + 22px 아이콘 (Figma: 복지 타일) */
export function BenefitTile({ kind }: { kind: BenefitIconKind }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-100">
      <InsetIcon {...BENEFIT_ICONS[kind]} className="size-[22px]" />
    </span>
  )
}

/** 장소 타일 — 48px 둥근 사각 + 24px 아이콘 (Figma: 장소 타일). inverse는 파란 카드 위 흰 타일 */
export function PlaceTile({ kind, inverse = false }: { kind: PlaceIconKind; inverse?: boolean }) {
  return (
    <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${inverse ? 'bg-surface' : 'bg-primary'}`}>
      <InsetIcon {...PLACE_ICONS[kind]} tint={inverse ? 'bg-primary' : undefined} className="size-6" />
    </span>
  )
}
