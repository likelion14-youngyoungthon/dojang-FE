import chevronRightIcon from '../assets/icons/chevron-right-20.svg'
import { BenefitIcon, type BenefitKind } from './BenefitIcon'
import { StatusChip, type ApplicationStatus } from './StatusChip'

interface BenefitRowProps {
  kind: BenefitKind
  title: string
  summary: string
  status: ApplicationStatus
}

/** 남은 신청 목록의 한 줄 (Figma: 남은 신청 행) */
export function BenefitRow({ kind, title, summary, status }: BenefitRowProps) {
  return (
    <div className="flex items-center gap-4 bg-surface px-6 py-[15px]">
      <BenefitIcon kind={kind} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-17 font-bold whitespace-nowrap text-text-strong">{title}</p>
        <p className="truncate text-15 text-text">{summary}</p>
      </div>
      <StatusChip status={status} />
      <img src={chevronRightIcon} alt="" width={20} height={20} className="shrink-0" />
    </div>
  )
}
