import { Link } from 'react-router'
import chevronRightIcon from '../../assets/icons/chevron-right-20.svg'
import chevronRightPrimaryIcon from '../../assets/icons/chevron-right-primary-16.svg'
import phoneIcon from '../../assets/icons/phone.svg'
import type { Benefit, Office } from '../../data/results'
import { StatusChip } from '../StatusChip'
import { Card } from './Card'
import { BenefitTile, PlaceTile } from './Tiles'

interface OfficeGroupCardProps {
  /** null이면 "모집 기간에만 신청" 묶음 */
  office: Office | null
  benefits: Benefit[]
}

/** 접수처별로 묶은 남은 신청 카드 (Figma: 카드 · 접수처 머리 + 남은 신청 행) */
export function OfficeGroupCard({ office, benefits }: OfficeGroupCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2 px-6 pt-[18px] pb-3.5">
        <PlaceTile kind={office?.icon ?? 'recruit'} />
        <h2 className="text-22 font-bold text-text-strong">{office?.name ?? '모집 기간에만 신청'}</h2>
        <span className="text-17 font-bold text-primary">{benefits.length}건</span>
        <span className="flex-1" />
        {office ? (
          <div className="flex items-center gap-2">
            <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-17 font-medium text-text">
              <img src={phoneIcon} alt="" width={16} height={16} />
              {office.phone}
            </a>
            <span className="px-1" aria-hidden>
              <span className="block h-3 w-px bg-divider" />
            </span>
            <Link
              to={`/results/locations?office=${office.id}`}
              className="flex items-center gap-0.5 text-17 font-medium text-primary hover:underline"
              aria-label={`${office.name} 위치`}
            >
              위치
              <img src={chevronRightPrimaryIcon} alt="" width={16} height={16} />
            </Link>
          </div>
        ) : (
          <p className="text-15 text-text-sub">모집 글이 나오면 그 기간에 신청해요</p>
        )}
      </div>

      <ul>
        {benefits.map((b) => (
          <li key={b.id} className="border-t border-divider">
            <Link to={`/results/${b.id}`} className="flex items-center gap-4 px-6 py-[15px] hover:bg-bg-sidebar">
              <BenefitTile kind={b.icon} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-17 font-bold text-text-strong">{b.name}</span>
                <span className="flex flex-wrap items-center gap-1.5 text-17 text-text">
                  {b.summary}
                  {b.checkNote && <span className="font-medium text-warn">· {b.checkNote}</span>}
                </span>
              </span>
              <StatusChip status={b.status} />
              <img src={chevronRightIcon} alt="" width={20} height={20} className="shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
