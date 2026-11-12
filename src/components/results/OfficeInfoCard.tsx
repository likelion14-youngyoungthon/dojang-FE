import { useNavigate } from 'react-router'
import externalLinkIcon from '../../assets/icons/external-link-primary.svg'
import pinDarkIcon from '../../assets/icons/pin-dark.svg'
import type { Office } from '../../data/results'
import { Card, KeyValueList } from './Card'
import { PlaceTile } from './Tiles'

/** 접수처 정보 카드: 장소 + 주소·전화 + 위치 보기 (+ 온라인 신청 링크) */
export function OfficeInfoCard({ office, onlineUrl }: { office: Office; onlineUrl?: string }) {
  const navigate = useNavigate()
  return (
    <Card className="gap-3.5 p-6">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <PlaceTile kind={office.icon} />
          <p className="text-17 font-bold text-text-strong">{office.name}</p>
        </div>
        <KeyValueList
          lastDivider={Boolean(onlineUrl)}
          rows={[
            { label: '주소', value: office.addressLines.map((line) => <p key={line}>{line}</p>) },
            { label: '전화', value: <a href={`tel:${office.phone}`}>{office.phone}</a> },
          ]}
        />
      </div>
      <button
        type="button"
        onClick={() => navigate(`/results/locations?office=${office.id}`)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-5 text-15 font-medium text-text-strong hover:bg-bg-sidebar"
      >
        <img src={pinDarkIcon} alt="" width={20} height={20} />
        위치 보기
      </button>
      {onlineUrl && (
        <a
          href={onlineUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 items-center gap-2 self-start rounded-xl px-2 text-15 font-medium text-primary hover:underline"
        >
          <img src={externalLinkIcon} alt="" width={20} height={20} />
          복지로에서 온라인 신청
        </a>
      )}
    </Card>
  )
}
