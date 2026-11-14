import statusDotPrimaryIcon from '../assets/icons/status-dot-primary.svg'
import statusDotSubIcon from '../assets/icons/status-dot-sub.svg'
import statusDotSuccessIcon from '../assets/icons/status-dot-success.svg'
import statusDotWarnIcon from '../assets/icons/status-dot-warn.svg'

// 화면 이름 ↔ 서버 status (Figma 머리말 · 상태 이름 표)
const STATUS = {
  before: { label: '신청 전', dot: statusDotSubIcon, className: 'bg-neutral-100 text-text' },
  check: { label: '확인 필요', dot: statusDotWarnIcon, className: 'bg-warn-100 text-warn' },
  recruit: { label: '모집 기간', dot: statusDotSubIcon, className: 'bg-neutral-100 text-text' },
  submitted: { label: '심사 대기 중', dot: statusDotPrimaryIcon, className: 'bg-primary-100 text-primary' },
  approved: { label: '결과 나옴', dot: statusDotSuccessIcon, className: 'bg-success-100 text-success' },
  in_use: { label: '이용 중', dot: statusDotSuccessIcon, className: 'bg-success-100 text-success' },
} as const

export type ApplicationStatus = keyof typeof STATUS

/** 신청 상태 칩 (Figma: 상태 칩) */
export function StatusChip({ status }: { status: ApplicationStatus }) {
  const { label, dot, className } = STATUS[status]
  return (
    <span className={`flex shrink-0 items-center gap-1.5 rounded-lg py-[3px] pr-2.5 pl-2 text-13 font-bold whitespace-nowrap ${className}`}>
      <img src={dot} alt="" width={6} height={6} />
      {label}
    </span>
  )
}
