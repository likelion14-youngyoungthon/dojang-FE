import { Link } from 'react-router'
import pinIcon from '../assets/icons/pin.svg'
import { STATUS_META, type Service } from '../data/services'
import { Badge } from './Badge'

/** 남은 신청 카드 (Figma: Card / 장애인연금 등) */
export function ServiceCard({ service, userName }: { service: Service; userName: string }) {
  const meta = STATUS_META[service.status]
  return (
    <article className="flex flex-col gap-2 rounded-[10px] border border-gray-200 bg-white px-6 pt-5 pb-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[18px] font-bold">{service.name}</h3>
        <Badge tone={meta.tone}>{meta.badge}</Badge>
      </div>
      <p className="text-[14px] text-gray-700">
        {userName} 님 · {service.target}
      </p>
      <p className="text-[15px] font-medium">{service.summary}</p>
      <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
        <p className="text-[13px] text-gray-500">데이터 기준일 {service.dataDate}</p>
        <Link
          to={`/services/${service.id}`}
          className="text-[14px] font-bold whitespace-pre text-primary hover:underline"
        >
          {service.status === 'check' ? '조건 확인  →' : '상세 보기  →'}
        </Link>
      </div>
    </article>
  )
}

export function GroupHead({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-1.5 text-[15px] font-bold text-gray-700">
      <img src={pinIcon} alt="" width={16} height={16} />
      {children}
    </h2>
  )
}
